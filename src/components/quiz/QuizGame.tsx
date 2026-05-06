import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, Flame, Target, ArrowLeft, BookOpen, GraduationCap, Loader2, Zap, Heart, Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { supabase } from '@/integrations/supabase/client';

interface QuizGameProps {
  topic: string;
  classLevel: string;
  studentName: string;
  leadId: string;
  onEnd: () => void;
}

interface Question {
  id: string;
  question: string;
  options: string[];
}

const getLevelFromScore = (score: number): { name: string; nameHi: string; color: string; bg: string } => {
  if (score >= 80) return { name: 'Champion', nameHi: 'चैंपियन', color: 'text-yellow-400', bg: 'bg-gradient-to-r from-yellow-500 to-orange-500' };
  if (score >= 50) return { name: 'Performer', nameHi: 'परफॉर्मर', color: 'text-purple-400', bg: 'bg-gradient-to-r from-purple-500 to-pink-500' };
  if (score >= 25) return { name: 'Learner', nameHi: 'लर्नर', color: 'text-blue-400', bg: 'bg-gradient-to-r from-blue-500 to-cyan-500' };
  return { name: 'Beginner', nameHi: 'बिगिनर', color: 'text-gray-400', bg: 'bg-gradient-to-r from-gray-500 to-slate-500' };
};

const getLevelIcon = (score: number) => {
  if (score >= 80) return Trophy;
  if (score >= 50) return Flame;
  if (score >= 25) return Target;
  return Star;
};

const topicEmojis: Record<string, string> = {
  maths: '🔢',
  science: '🔬',
  gk: '🌍',
  reasoning: '🧠',
  history: '📜',
};

export const QuizGame = ({ topic, classLevel, studentName, leadId, onEnd }: QuizGameProps) => {
  const { t, language } = useLanguage();
  const { playCorrect, playWrong, playLevelUp, playClick } = useSoundEffects();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [lastCorrectIndex, setLastCorrectIndex] = useState<number | null>(null);

  // Timer effect
  useEffect(() => {
    if (loading || isComplete || showResult || selectedAnswer !== null) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isComplete, showResult, selectedAnswer, currentQuestionIndex]);

  const handleTimeout = () => {
    playWrong();
    setLives(prev => prev - 1);
    setStreak(0);
    setComboMultiplier(1);
    moveToNextQuestion();
  };

  // Fetch questions from database
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('quiz_questions')
          .select('id, question, options')
          .eq('topic', topic)
          .eq('class_level', classLevel)
          .eq('language', language)
          .limit(15);

        if (error) throw error;

        if (data && data.length > 0) {
          const shuffled = data.sort(() => Math.random() - 0.5).slice(0, 10);
          setQuestions(shuffled.map(q => ({
            id: q.id,
            question: q.question,
            options: q.options as string[],
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
      const newSessionId = crypto.randomUUID();
      setSessionId(newSessionId);

      try {
        await supabase.from('quiz_sessions').insert({
          id: newSessionId,
          lead_id: leadId,
          topic: topic,
          completed: false,
          score: 0,
          correct_answers: 0,
          questions_attempted: 0,
          level: 'Beginner'
        });
      } catch (err) {
        console.error('Error creating session:', err);
      }
    };

    createSession();
  }, [leadId, topic]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const levelInfo = getLevelFromScore(score);
  const LevelIcon = getLevelIcon(score);

  const updateSession = useCallback(async (finalScore: number, finalCorrect: number, finalLevel: string) => {
    if (!sessionId) return;
    try {
      await supabase.functions.invoke('update-quiz-session', {
        body: {
          session_id: sessionId,
          completed: true,
          score: finalScore,
          correct_answers: finalCorrect,
          questions_attempted: questions.length,
          level: finalLevel,
        },
      });
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }, [sessionId, questions.length]);

  const moveToNextQuestion = () => {
    setTimeLeft(30);
    setLastCorrectIndex(null);
    if (lives <= 0) {
      const finalLevel = getLevelFromScore(score);
      setIsComplete(true);
      updateSession(score, correctAnswers, finalLevel.name);
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const finalLevel = getLevelFromScore(score);
      setIsComplete(true);
      updateSession(score, correctAnswers, finalLevel.name);
    }
  };

  const handleAnswerSelect = async (index: number) => {
    if (selectedAnswer !== null) return;
    
    playClick();
    setSelectedAnswer(index);
    setShowResult(true);

    let isCorrect = false;
    try {
      const { data } = await supabase.functions.invoke('check-quiz-answer', {
        body: { question_id: currentQuestion.id, selected_answer: index },
      });
      isCorrect = !!data?.correct;
    } catch (e) {
      console.error('Answer check failed:', e);
    }
    setLastCorrectIndex(isCorrect ? index : -1);
    
    if (isCorrect) {
      playCorrect();
      const bonusPoints = Math.floor(timeLeft / 3);
      const streakBonus = streak >= 3 ? 5 : 0;
      const pointsEarned = (10 + bonusPoints + streakBonus) * comboMultiplier;
      
      setScore(prev => prev + pointsEarned);
      setCorrectAnswers(prev => prev + 1);
      setStreak(prev => prev + 1);
      
      if ((streak + 1) % 3 === 0) {
        setComboMultiplier(prev => Math.min(prev + 0.5, 3));
        setShowLevelUp(true);
        playLevelUp();
        setTimeout(() => setShowLevelUp(false), 1500);
      }
    } else {
      playWrong();
      setLives(prev => prev - 1);
      setStreak(0);
      setComboMultiplier(1);
    }

    setTimeout(moveToNextQuestion, 1800);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <Sparkles className="h-8 w-8 text-yellow-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-white mt-6 text-lg font-medium animate-pulse">
            {language === 'hi' ? '🎮 गेम लोड हो रहा है...' : '🎮 Loading Game...'}
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-slate-800/80 border-purple-500/30">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {language === 'hi' ? 'प्रश्न जल्द आ रहे हैं!' : 'Questions Coming Soon!'}
            </h2>
            <p className="text-purple-200 mb-6">
              {language === 'hi' ? 'इस विषय के प्रश्न जल्द जोड़े जाएंगे' : 'Questions for this topic will be added soon'}
            </p>
            <Button onClick={onEnd} className="bg-gradient-to-r from-purple-600 to-pink-600">
              {language === 'hi' ? 'वापस जाएं' : 'Go Back'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
        {/* Celebration particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6'][i % 5],
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <Card className="max-w-lg w-full bg-slate-800/90 border-2 border-yellow-500/50 shadow-2xl shadow-yellow-500/20 animate-scale-in relative z-10">
          <CardContent className="p-8 text-center">
            {/* Trophy with glow */}
            <div className="relative inline-block mb-6">
              <div className={`w-28 h-28 ${levelInfo.bg} rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/30`}>
                <Trophy className="h-14 w-14 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-slate-900 rounded-full px-3 py-1 text-sm font-bold animate-bounce">
                {levelInfo.name}
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2">
              {language === 'hi' ? '🎉 बधाई हो!' : '🎉 Congratulations!'}
            </h2>
            <p className="text-purple-200 mb-6">{studentName}</p>
            
            {/* Stats Grid - Arcade Style */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-4 transform hover:scale-105 transition-transform">
                <p className="text-4xl font-bold text-white">{score}</p>
                <p className="text-blue-100 text-sm">{language === 'hi' ? 'स्कोर' : 'SCORE'}</p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-4 transform hover:scale-105 transition-transform">
                <p className="text-4xl font-bold text-white">{correctAnswers}/{questions.length}</p>
                <p className="text-green-100 text-sm">{language === 'hi' ? 'सही जवाब' : 'CORRECT'}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-4 transform hover:scale-105 transition-transform">
                <p className="text-4xl font-bold text-white">{Math.round((correctAnswers / questions.length) * 100)}%</p>
                <p className="text-purple-100 text-sm">{language === 'hi' ? 'एक्यूरेसी' : 'ACCURACY'}</p>
              </div>
              <div className={`${levelInfo.bg} rounded-2xl p-4 transform hover:scale-105 transition-transform`}>
                <LevelIcon className="h-8 w-8 text-white mx-auto mb-1" />
                <p className="text-white text-sm font-bold">{language === 'hi' ? levelInfo.nameHi : levelInfo.name}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={onEnd} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg h-14">
                {language === 'hi' ? '🎮 फिर से खेलें' : '🎮 Play Again'}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button asChild variant="outline" className="border-purple-500 text-purple-300 hover:bg-purple-500/20">
                  <Link to="/career">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {language === 'hi' ? 'करियर' : 'Career'}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/20">
                  <Link to="/library">
                    <BookOpen className="mr-2 h-4 w-4" />
                    {language === 'hi' ? 'लाइब्रेरी' : 'Library'}
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-4 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Top Bar - Arcade Style */}
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={onEnd} 
            size="sm"
            className="text-purple-300 hover:text-white hover:bg-purple-500/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {language === 'hi' ? 'छोड़ें' : 'Quit'}
          </Button>
          
          <div className="flex items-center gap-3">
            {/* Lives */}
            <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-full">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`h-5 w-5 transition-all ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} 
                />
              ))}
            </div>

            {/* Score */}
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-1.5 rounded-full flex items-center gap-2">
              <Star className="h-4 w-4 text-white" />
              <span className="font-bold text-white">{score}</span>
            </div>

            {/* Combo */}
            {comboMultiplier > 1 && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 rounded-full animate-pulse">
                <span className="font-bold text-white text-sm">{comboMultiplier}x</span>
              </div>
            )}
          </div>
        </div>

        {/* Player Info Bar */}
        <div className="flex items-center justify-between mb-4 bg-slate-800/30 rounded-xl p-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${levelInfo.bg} rounded-full flex items-center justify-center`}>
              <span className="text-lg">{topicEmojis[topic] || '📚'}</span>
            </div>
            <div>
              <p className="text-white font-medium">{studentName}</p>
              <p className="text-purple-300 text-xs">{language === 'hi' ? levelInfo.nameHi : levelInfo.name}</p>
            </div>
          </div>
          
          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-full">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-orange-300 font-bold">{streak} 🔥</span>
            </div>
          )}
        </div>

        {/* Timer & Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-300 text-sm">
              {language === 'hi' ? 'प्रश्न' : 'Question'} {currentQuestionIndex + 1}/{questions.length}
            </span>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 10 ? 'bg-red-500/30 animate-pulse' : 'bg-slate-700/50'}`}>
              <Clock className={`h-4 w-4 ${timeLeft <= 10 ? 'text-red-400' : 'text-purple-300'}`} />
              <span className={`font-mono font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Level Up Animation */}
        {showLevelUp && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-center animate-bounce">
              <Zap className="h-20 w-20 text-yellow-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-400">
                {language === 'hi' ? '🔥 कॉम्बो!' : '🔥 COMBO!'}
              </p>
              <p className="text-xl text-yellow-300">{comboMultiplier}x Multiplier!</p>
            </div>
          </div>
        )}

        {/* Question Card - Arcade Style */}
        <Card className="mb-6 bg-slate-800/80 border-2 border-purple-500/30 shadow-xl shadow-purple-500/10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-3 border-b border-purple-500/20">
            <span className="text-purple-300 text-sm uppercase tracking-wider">
              {topicEmojis[topic]} {topic.charAt(0).toUpperCase() + topic.slice(1)}
            </span>
          </div>
          <CardContent className="p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-white mb-8 leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                let optionClass = 'border-2 border-slate-600 bg-slate-700/50 hover:border-purple-400 hover:bg-purple-500/10 text-white';
                
                if (showResult) {
                  if (index === lastCorrectIndex) {
                    optionClass = 'border-2 border-green-400 bg-green-500/20 text-green-300 scale-105';
                  } else if (index === selectedAnswer && index !== lastCorrectIndex) {
                    optionClass = 'border-2 border-red-400 bg-red-500/20 text-red-300 animate-shake';
                  } else {
                    optionClass = 'border-2 border-slate-700 bg-slate-800/50 text-slate-500';
                  }
                } else if (selectedAnswer === index) {
                  optionClass = 'border-2 border-purple-400 bg-purple-500/20 text-purple-200';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-xl text-left transition-all duration-200 ${optionClass}`}
                  >
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-600/50 text-sm font-bold mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Result Feedback */}
        {showResult && (
          <div className={`text-center p-4 rounded-xl animate-scale-in ${
            selectedAnswer === lastCorrectIndex
              ? 'bg-green-500/20 border border-green-500/50' 
              : 'bg-red-500/20 border border-red-500/50'
          }`}>
            <p className={`text-2xl font-bold ${
              selectedAnswer === lastCorrectIndex ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedAnswer === lastCorrectIndex
                ? (language === 'hi' ? '✅ सही जवाब!' : '✅ Correct!') 
                : (language === 'hi' ? '❌ गलत!' : '❌ Wrong!')}
            </p>
            {selectedAnswer === lastCorrectIndex && (
              <p className="text-green-300 mt-1">
                +{(10 + Math.floor(timeLeft / 3)) * comboMultiplier} {language === 'hi' ? 'पॉइंट्स' : 'points'}
              </p>
            )}
          </div>
        )}
      </div>

      {/* CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
