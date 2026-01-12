import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Star, Trophy, Flame, Target, ArrowLeft, BookOpen, GraduationCap } from 'lucide-react';
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

// Generate questions based on topic and class
const generateQuestions = (topic: string, classLevel: string, language: string): Question[] => {
  const isHindi = language === 'hi';
  
  const questionBank: Record<string, Record<string, Question[]>> = {
    reasoning: {
      '6-8': isHindi ? [
        { question: 'अगले नंबर का पता लगाएं: 2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], correctAnswer: 1 },
        { question: 'यदि APPLE = 50, तो CAT = ?', options: ['24', '27', '30', '33'], correctAnswer: 0 },
        { question: 'उस चित्र को चुनें जो समूह से अलग है', options: ['वृत्त', 'वर्ग', 'त्रिभुज', 'रेखा'], correctAnswer: 3 },
        { question: 'अगर परसों शुक्रवार था, तो कल क्या होगा?', options: ['शनिवार', 'रविवार', 'सोमवार', 'मंगलवार'], correctAnswer: 2 },
        { question: 'श्रृंखला पूर्ण करें: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correctAnswer: 1 },
      ] : [
        { question: 'Find the next number: 2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], correctAnswer: 1 },
        { question: 'If APPLE = 50, then CAT = ?', options: ['24', '27', '30', '33'], correctAnswer: 0 },
        { question: 'Choose the odd one out', options: ['Circle', 'Square', 'Triangle', 'Line'], correctAnswer: 3 },
        { question: 'If day before yesterday was Friday, what day is tomorrow?', options: ['Saturday', 'Sunday', 'Monday', 'Tuesday'], correctAnswer: 2 },
        { question: 'Complete the series: A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], correctAnswer: 1 },
      ],
      '9-12': isHindi ? [
        { question: 'श्रृंखला में लुप्त संख्या ज्ञात करें: 3, 9, 27, 81, ?', options: ['162', '243', '324', '405'], correctAnswer: 1 },
        { question: 'यदि A ÷ B का अर्थ A, B का पिता है; A × B का अर्थ A, B की माँ है, तो P ÷ Q × R में R, P से कैसे संबंधित है?', options: ['पोता/पोती', 'पुत्र', 'पुत्री', 'भाई'], correctAnswer: 0 },
        { question: 'एक कोड में COMPUTER को RFUVQNPC लिखा जाता है। SOFTWARE कैसे लिखा जाएगा?', options: ['FBUXSGPT', 'TPGXWSBT', 'FBXWTPGS', 'TPGXWSBU'], correctAnswer: 1 },
        { question: 'यदि 5 * 3 = 16, 7 * 4 = 33, तो 9 * 5 = ?', options: ['50', '54', '56', '58'], correctAnswer: 2 },
        { question: 'किसी घड़ी में 3:15 बजे घंटे की सुई और मिनट की सुई के बीच का कोण क्या है?', options: ['0°', '7.5°', '15°', '22.5°'], correctAnswer: 1 },
      ] : [
        { question: 'Find the missing number in series: 3, 9, 27, 81, ?', options: ['162', '243', '324', '405'], correctAnswer: 1 },
        { question: 'If A ÷ B means A is father of B; A × B means A is mother of B, then P ÷ Q × R means R is what of P?', options: ['Grandchild', 'Son', 'Daughter', 'Brother'], correctAnswer: 0 },
        { question: 'In a code COMPUTER is written as RFUVQNPC. How is SOFTWARE written?', options: ['FBUXSGPT', 'TPGXWSBT', 'FBXWTPGS', 'TPGXWSBU'], correctAnswer: 1 },
        { question: 'If 5 * 3 = 16, 7 * 4 = 33, then 9 * 5 = ?', options: ['50', '54', '56', '58'], correctAnswer: 2 },
        { question: 'What is the angle between hour and minute hand at 3:15?', options: ['0°', '7.5°', '15°', '22.5°'], correctAnswer: 1 },
      ],
    },
    history: {
      '6-8': isHindi ? [
        { question: 'भारत के पहले प्रधानमंत्री कौन थे?', options: ['महात्मा गांधी', 'जवाहरलाल नेहरू', 'सरदार पटेल', 'राजेंद्र प्रसाद'], correctAnswer: 1 },
        { question: 'ताजमहल किस मुगल सम्राट ने बनवाया?', options: ['अकबर', 'जहांगीर', 'शाहजहां', 'औरंगजेब'], correctAnswer: 2 },
        { question: 'भारत में अंग्रेजों का पहला व्यापार केंद्र कहाँ था?', options: ['मद्रास', 'सूरत', 'कलकत्ता', 'मुंबई'], correctAnswer: 1 },
        { question: 'सिंधु घाटी सभ्यता की खोज किस वर्ष हुई?', options: ['1921', '1922', '1920', '1923'], correctAnswer: 1 },
        { question: 'भारतीय राष्ट्रीय कांग्रेस की स्थापना कब हुई?', options: ['1885', '1857', '1947', '1905'], correctAnswer: 0 },
      ] : [
        { question: 'Who was the first Prime Minister of India?', options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Rajendra Prasad'], correctAnswer: 1 },
        { question: 'Who built the Taj Mahal?', options: ['Akbar', 'Jahangir', 'Shah Jahan', 'Aurangzeb'], correctAnswer: 2 },
        { question: 'Where was the first British trading post in India?', options: ['Madras', 'Surat', 'Calcutta', 'Mumbai'], correctAnswer: 1 },
        { question: 'In which year was the Indus Valley Civilization discovered?', options: ['1921', '1922', '1920', '1923'], correctAnswer: 1 },
        { question: 'When was the Indian National Congress founded?', options: ['1885', '1857', '1947', '1905'], correctAnswer: 0 },
      ],
      '9-12': isHindi ? [
        { question: '1857 की क्रांति का तात्कालिक कारण क्या था?', options: ['भूमि कर', 'एनफील्ड राइफल कारतूस', 'सती प्रथा', 'व्यापार नीति'], correctAnswer: 1 },
        { question: 'साइमन कमीशन भारत कब आया?', options: ['1927', '1928', '1929', '1930'], correctAnswer: 1 },
        { question: '"इंकलाब जिंदाबाद" का नारा किसने दिया?', options: ['भगत सिंह', 'चंद्रशेखर आजाद', 'सुभाष चंद्र बोस', 'महात्मा गांधी'], correctAnswer: 0 },
        { question: 'भारत छोड़ो आंदोलन कब शुरू हुआ?', options: ['1940', '1942', '1944', '1946'], correctAnswer: 1 },
        { question: 'द्वितीय विश्व युद्ध कब शुरू हुआ?', options: ['1937', '1938', '1939', '1940'], correctAnswer: 2 },
      ] : [
        { question: 'What was the immediate cause of 1857 Revolt?', options: ['Land tax', 'Enfield rifle cartridges', 'Sati practice', 'Trade policy'], correctAnswer: 1 },
        { question: 'When did Simon Commission come to India?', options: ['1927', '1928', '1929', '1930'], correctAnswer: 1 },
        { question: 'Who gave the slogan "Inquilab Zindabad"?', options: ['Bhagat Singh', 'Chandrashekhar Azad', 'Subhash Chandra Bose', 'Mahatma Gandhi'], correctAnswer: 0 },
        { question: 'When did Quit India Movement start?', options: ['1940', '1942', '1944', '1946'], correctAnswer: 1 },
        { question: 'When did World War II begin?', options: ['1937', '1938', '1939', '1940'], correctAnswer: 2 },
      ],
    },
    maths: {
      '6-8': isHindi ? [
        { question: '25 × 4 = ?', options: ['90', '100', '110', '120'], correctAnswer: 1 },
        { question: '144 का वर्गमूल क्या है?', options: ['10', '11', '12', '13'], correctAnswer: 2 },
        { question: 'यदि x + 5 = 12, तो x = ?', options: ['5', '6', '7', '8'], correctAnswer: 2 },
        { question: '3/4 + 1/4 = ?', options: ['1/2', '1', '4/4', 'दोनों b और c'], correctAnswer: 3 },
        { question: 'त्रिभुज के सभी कोणों का योग कितना होता है?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1 },
      ] : [
        { question: '25 × 4 = ?', options: ['90', '100', '110', '120'], correctAnswer: 1 },
        { question: 'What is the square root of 144?', options: ['10', '11', '12', '13'], correctAnswer: 2 },
        { question: 'If x + 5 = 12, then x = ?', options: ['5', '6', '7', '8'], correctAnswer: 2 },
        { question: '3/4 + 1/4 = ?', options: ['1/2', '1', '4/4', 'Both b and c'], correctAnswer: 3 },
        { question: 'Sum of all angles in a triangle is?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1 },
      ],
      '9-12': isHindi ? [
        { question: 'द्विघात समीकरण x² - 5x + 6 = 0 के मूल क्या हैं?', options: ['2, 3', '1, 6', '-2, -3', '3, 4'], correctAnswer: 0 },
        { question: 'sin 30° का मान क्या है?', options: ['1/2', '1/√2', '√3/2', '1'], correctAnswer: 0 },
        { question: 'log₁₀ 1000 = ?', options: ['2', '3', '4', '10'], correctAnswer: 1 },
        { question: 'यदि a = 2, b = 3 है, तो (a + b)² = ?', options: ['25', '13', '36', '49'], correctAnswer: 0 },
        { question: 'एक वृत्त का क्षेत्रफल 154 cm² है। उसकी त्रिज्या क्या है? (π = 22/7)', options: ['7 cm', '14 cm', '21 cm', '49 cm'], correctAnswer: 0 },
      ] : [
        { question: 'What are the roots of x² - 5x + 6 = 0?', options: ['2, 3', '1, 6', '-2, -3', '3, 4'], correctAnswer: 0 },
        { question: 'What is the value of sin 30°?', options: ['1/2', '1/√2', '√3/2', '1'], correctAnswer: 0 },
        { question: 'log₁₀ 1000 = ?', options: ['2', '3', '4', '10'], correctAnswer: 1 },
        { question: 'If a = 2, b = 3, then (a + b)² = ?', options: ['25', '13', '36', '49'], correctAnswer: 0 },
        { question: 'Area of a circle is 154 cm². What is radius? (π = 22/7)', options: ['7 cm', '14 cm', '21 cm', '49 cm'], correctAnswer: 0 },
      ],
    },
    science: {
      '6-8': isHindi ? [
        { question: 'पानी का रासायनिक सूत्र क्या है?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctAnswer: 0 },
        { question: 'सूर्य के प्रकाश में कितने रंग होते हैं?', options: ['5', '6', '7', '8'], correctAnswer: 2 },
        { question: 'मनुष्य के शरीर में सबसे बड़ी हड्डी कौन सी है?', options: ['रीढ़ की हड्डी', 'फीमर', 'खोपड़ी', 'पसली'], correctAnswer: 1 },
        { question: 'प्रकाश संश्लेषण में कौन सी गैस निकलती है?', options: ['CO2', 'O2', 'N2', 'H2'], correctAnswer: 1 },
        { question: 'पृथ्वी का उपग्रह कौन है?', options: ['सूर्य', 'मंगल', 'चंद्रमा', 'शुक्र'], correctAnswer: 2 },
      ] : [
        { question: 'What is the chemical formula of water?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctAnswer: 0 },
        { question: 'How many colors are in sunlight?', options: ['5', '6', '7', '8'], correctAnswer: 2 },
        { question: 'What is the largest bone in human body?', options: ['Spine', 'Femur', 'Skull', 'Rib'], correctAnswer: 1 },
        { question: 'Which gas is released during photosynthesis?', options: ['CO2', 'O2', 'N2', 'H2'], correctAnswer: 1 },
        { question: 'What is Earth\'s satellite?', options: ['Sun', 'Mars', 'Moon', 'Venus'], correctAnswer: 2 },
      ],
      '9-12': isHindi ? [
        { question: 'परमाणु के नाभिक में क्या होता है?', options: ['इलेक्ट्रॉन', 'प्रोटॉन और न्यूट्रॉन', 'केवल प्रोटॉन', 'केवल न्यूट्रॉन'], correctAnswer: 1 },
        { question: 'प्रकाश की गति कितनी है?', options: ['3×10⁶ m/s', '3×10⁷ m/s', '3×10⁸ m/s', '3×10⁹ m/s'], correctAnswer: 2 },
        { question: 'DNA का पूरा नाम क्या है?', options: ['Dioxyribo Nucleic Acid', 'Deoxyribonucleic Acid', 'Dinucleic Acid', 'Dual Nucleic Acid'], correctAnswer: 1 },
        { question: 'ओम के नियम का सूत्र क्या है?', options: ['V = IR', 'V = I/R', 'V = I+R', 'V = I-R'], correctAnswer: 0 },
        { question: 'सोडियम क्लोराइड का रासायनिक सूत्र क्या है?', options: ['NaCl', 'NaCl2', 'Na2Cl', 'NaOH'], correctAnswer: 0 },
      ] : [
        { question: 'What is inside the nucleus of an atom?', options: ['Electrons', 'Protons and Neutrons', 'Only Protons', 'Only Neutrons'], correctAnswer: 1 },
        { question: 'What is the speed of light?', options: ['3×10⁶ m/s', '3×10⁷ m/s', '3×10⁸ m/s', '3×10⁹ m/s'], correctAnswer: 2 },
        { question: 'What is the full form of DNA?', options: ['Dioxyribo Nucleic Acid', 'Deoxyribonucleic Acid', 'Dinucleic Acid', 'Dual Nucleic Acid'], correctAnswer: 1 },
        { question: 'What is Ohm\'s law formula?', options: ['V = IR', 'V = I/R', 'V = I+R', 'V = I-R'], correctAnswer: 0 },
        { question: 'What is the chemical formula of sodium chloride?', options: ['NaCl', 'NaCl2', 'Na2Cl', 'NaOH'], correctAnswer: 0 },
      ],
    },
    gk: {
      '6-8': isHindi ? [
        { question: 'भारत की राजधानी क्या है?', options: ['मुंबई', 'कोलकाता', 'नई दिल्ली', 'चेन्नई'], correctAnswer: 2 },
        { question: 'भारत का राष्ट्रीय पक्षी कौन है?', options: ['कबूतर', 'मोर', 'तोता', 'कौआ'], correctAnswer: 1 },
        { question: 'भारत में कुल कितने राज्य हैं?', options: ['26', '27', '28', '29'], correctAnswer: 2 },
        { question: 'गंगा नदी कहाँ से निकलती है?', options: ['हिमालय', 'विंध्याचल', 'अरावली', 'नीलगिरी'], correctAnswer: 0 },
        { question: 'भारतीय मुद्रा का नाम क्या है?', options: ['डॉलर', 'यूरो', 'रुपया', 'पाउंड'], correctAnswer: 2 },
      ] : [
        { question: 'What is the capital of India?', options: ['Mumbai', 'Kolkata', 'New Delhi', 'Chennai'], correctAnswer: 2 },
        { question: 'What is the national bird of India?', options: ['Pigeon', 'Peacock', 'Parrot', 'Crow'], correctAnswer: 1 },
        { question: 'How many states are in India?', options: ['26', '27', '28', '29'], correctAnswer: 2 },
        { question: 'Where does River Ganga originate?', options: ['Himalayas', 'Vindhya', 'Aravalli', 'Nilgiri'], correctAnswer: 0 },
        { question: 'What is Indian currency called?', options: ['Dollar', 'Euro', 'Rupee', 'Pound'], correctAnswer: 2 },
      ],
      '9-12': isHindi ? [
        { question: 'भारत के वर्तमान राष्ट्रपति कौन हैं?', options: ['राम नाथ कोविंद', 'द्रौपदी मुर्मू', 'प्रणब मुखर्जी', 'प्रतिभा पाटिल'], correctAnswer: 1 },
        { question: 'संयुक्त राष्ट्र का मुख्यालय कहाँ है?', options: ['जेनेवा', 'न्यूयॉर्क', 'पेरिस', 'लंदन'], correctAnswer: 1 },
        { question: 'विश्व का सबसे बड़ा महाद्वीप कौन सा है?', options: ['अफ्रीका', 'एशिया', 'यूरोप', 'उत्तरी अमेरिका'], correctAnswer: 1 },
        { question: 'भारतीय संविधान में कितने मौलिक अधिकार हैं?', options: ['5', '6', '7', '8'], correctAnswer: 1 },
        { question: 'ISRO का मुख्यालय कहाँ है?', options: ['मुंबई', 'बेंगलुरु', 'हैदराबाद', 'चेन्नई'], correctAnswer: 1 },
      ] : [
        { question: 'Who is the current President of India?', options: ['Ram Nath Kovind', 'Droupadi Murmu', 'Pranab Mukherjee', 'Pratibha Patil'], correctAnswer: 1 },
        { question: 'Where is UN Headquarters located?', options: ['Geneva', 'New York', 'Paris', 'London'], correctAnswer: 1 },
        { question: 'Which is the largest continent?', options: ['Africa', 'Asia', 'Europe', 'North America'], correctAnswer: 1 },
        { question: 'How many Fundamental Rights are in Indian Constitution?', options: ['5', '6', '7', '8'], correctAnswer: 1 },
        { question: 'Where is ISRO headquarters?', options: ['Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai'], correctAnswer: 1 },
      ],
    },
  };

  const classGroup = parseInt(classLevel) <= 8 ? '6-8' : '9-12';
  const topicQuestions = questionBank[topic]?.[classGroup] || questionBank.gk[classGroup];
  
  // Shuffle and return questions
  return [...topicQuestions].sort(() => Math.random() - 0.5);
};

export const QuizGame = ({ topic, classLevel, leadId, onEnd }: QuizGameProps) => {
  const { t, language } = useLanguage();
  const { playCorrect, playWrong, playLevelUp, playClick } = useSoundEffects();
  
  const [questions] = useState<Question[]>(() => generateQuestions(topic, classLevel, language));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [level, setLevel] = useState('Beginner');
  const [showLevelUp, setShowLevelUp] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const updateSession = useCallback(async () => {
    try {
      await supabase
        .from('leads')
        .update({
          quiz_topic: topic,
          quiz_score: score,
          quiz_level: level,
        })
        .eq('id', leadId);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }, [leadId, topic, score, level]);

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
    if (isCorrect) {
      playCorrect();
      setScore(prev => prev + 10);
      setCorrectAnswers(prev => prev + 1);
    } else {
      playWrong();
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setIsComplete(true);
        updateSession();
      }
    }, 1500);
  };

  const LevelIcon = getLevelIcon(level);

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
            Back
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
