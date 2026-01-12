import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, Flame, Target, ArrowLeft, BookOpen, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { supabase } from '@/integrations/supabase/client';

interface QuizGameProps {
  topic: string;
  classLevel: string;
  leadId: string;
  onEnd: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const getLevelFromScore = (score: number): string => {
  if (score >= 80) return 'Champion';
  if (score >= 50) return 'Performer';
  if (score >= 25) return 'Learner';
  return 'Beginner';
};

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'Champion': return Trophy;
    case 'Performer': return Flame;
    case 'Learner': return Target;
    default: return Star;
  }
};

export const QuizGame = ({ topic, classLevel, leadId, onEnd }: QuizGameProps) => {
  const { t, language } = useLanguage();
  const { playCorrect, playWrong, playLevelUp, playClick } = useSoundEffects();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [level, setLevel] = useState('Beginner');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Fetch questions from database
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('id, question, options, correct_answer')
          .eq('topic', topic)
          .eq('class_level', classLevel)
          .eq('language', language)
          .limit(10);

        if (error) throw error;

        if (data && data.length > 0) {
          const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 5);
          setQuestions(shuffled.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options as string[],
            correctAnswer: q.correct_answer
          })));
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, classLevel, language]);

  // Create quiz session
  useEffect(() => {
    const createSession = async () => {
      // IMPORTANT:
      // SELECT on quiz_sessions is admin-only (RLS). So we generate the id client-side
      // and insert without requesting the row back.
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);

      try {
        const { error } = await supabase
          .from('quiz_sessions')
          .insert({
            id: newSessionId,
            lead_id: leadId,
            topic: topic,
            completed: false,
            score: 0,
            correct_answers: 0,
            questions_attempted: 0,
            level: 'Beginner'
          });

        if (error) throw error;
      } catch (err) {
        console.error('Error creating session:', err);
        setSessionId(null);
      }
    };

    createSession();
  }, [leadId, topic]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const updateSession = useCallback(async (finalScore: number, finalCorrect: number, finalLevel: string) => {
    if (!sessionId) return;
    try {
      await supabase
        .from('quiz_sessions')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          score: finalScore,
          correct_answers: finalCorrect,
          questions_attempted: questions.length,
          level: finalLevel
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }, [sessionId, questions.length]);

  useEffect(() => {
    const newLevel = getLevelFromScore(score);
    if (newLevel !== level) {
      setLevel(newLevel);
      setShowLevelUp(true);
      playLevelUp();
      setTimeout(() => setShowLevelUp(false), 2000);
    }
  }, [score, level, playLevelUp]);

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === currentQuestion.correctAnswer;
    let newScore = score;
    let newCorrect = correctAnswers;
    
    if (isCorrect) {
      playCorrect();
      newScore = score + 10;
      newCorrect = correctAnswers + 1;
      setScore(newScore);
      setCorrectAnswers(newCorrect);
    } else {
      playWrong();
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalLevel = getLevelFromScore(newScore);
        setLevel(finalLevel);
        setIsComplete(true);
        updateSession(newScore, newCorrect, finalLevel);
      }
    }, 1500);
  };

  const LevelIcon = getLevelIcon(level);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{language === 'hi' ? 'प्रश्न लोड हो रहे हैं...' : 'Loading questions...'}</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{language === 'hi' ? 'प्रश्न उपलब्ध नहीं' : 'No Questions Available'}</h2>
            <p className="text-muted-foreground mb-6">{language === 'hi' ? 'इस विषय के लिए प्रश्न जल्द जोड़े जाएंगे' : 'Questions for this topic will be added soon'}</p>
            <Button onClick={onEnd}>{language === 'hi' ? 'वापस जाएं' : 'Go Back'}</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full animate-scale-in">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-6">{t('quiz.complete.title')}</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-muted rounded-xl p-4">
                <p className="text-3xl font-bold text-primary">{questions.length}</p>
                <p className="text-sm text-muted-foreground">{t('quiz.complete.attempted')}</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-3xl font-bold text-success">{correctAnswers}</p>
                <p className="text-sm text-muted-foreground">{t('quiz.complete.correct')}</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <p className="text-3xl font-bold text-secondary">{score}</p>
                <p className="text-sm text-muted-foreground">{t('quiz.complete.score')}</p>
              </div>
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center justify-center gap-1">
                  <LevelIcon className="h-5 w-5 text-warning" />
                  <p className="text-lg font-bold">{level}</p>
                </div>
                <p className="text-sm text-muted-foreground">{t('quiz.complete.level')}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={onEnd} className="bg-gradient-primary">
                {t('quiz.btn.more')}
              </Button>
              <Button asChild variant="outline">
                <Link to="/career">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  {t('quiz.btn.career')}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/library">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {t('quiz.btn.library')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onEnd} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'hi' ? 'वापस' : 'Back'}
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm">
              <Star className="h-4 w-4 text-warning" />
              <span className="font-semibold">{score}</span>
            </div>
            <div className={`flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm ${showLevelUp ? 'level-up' : ''}`}>
              <LevelIcon className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{level}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{t('quiz.question')} {currentQuestionIndex + 1}/{questions.length}</span>
            <span>{t(`topic.${topic}`)}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                let optionClass = 'border-2 border-border hover:border-primary/50 hover:bg-primary/5';
                
                if (showResult) {
                  if (index === currentQuestion.correctAnswer) {
                    optionClass = 'border-2 border-success bg-success/10 quiz-correct';
                  } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                    optionClass = 'border-2 border-destructive bg-destructive/10 quiz-wrong';
                  }
                } else if (selectedAnswer === index) {
                  optionClass = 'border-2 border-primary bg-primary/10';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-xl text-left transition-all ${optionClass}`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Result Feedback */}
        {showResult && (
          <div className={`text-center p-4 rounded-xl animate-scale-in ${
            selectedAnswer === currentQuestion.correctAnswer 
              ? 'bg-success/20 text-success' 
              : 'bg-destructive/20 text-destructive'
          }`}>
            <p className="text-lg font-semibold">
              {selectedAnswer === currentQuestion.correctAnswer 
                ? t('quiz.correct') 
                : t('quiz.wrong')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
