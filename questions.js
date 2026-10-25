/**
 * Comprehensive Database of interactive activities & questions tailored specifically
 * for the presentation: "Circulatory Systems in Animals & Insects"
 * 
 * Features:
 * - Quick Quiz: 4 options with instant grading (+30 correct, -15 penalty)
 * - Mystery Clue: Progressive clues (clues 2 & 3 cost -5 assistance points), with 4 guess options!
 * - Fix the Mistake: Statement with error, plus 4 multiple-choice correction options (+30 correct, -15 penalty)
 * - Act It Out & Explain It Fast: Theatrical and Taboo challenges evaluated exclusively by the Admin!
 * - Lucky Bug: Biology fortune cards
 */

const CIRCULATORY_ACTIVITIES = {
  quickQuiz: {
    id: 'quickQuiz',
    title: { en: 'Quick Quiz', ar: 'اختبار سريع' },
    icon: '💡',
    color: '#FF6584',
    description: { 
      en: 'Test your deep knowledge on animal & insect circulatory systems!',
      ar: 'اختبر معلوماتك العميقة حول الأجهزة الدورية في الحيوانات والحشرات!'
    },
    items: [
      {
        id: 'qq_1',
        question: { 
          en: 'Why is insect hemolymph usually colorless, pale yellow, or green instead of red?', 
          ar: 'لماذا يكون سائل الهيموليمف في معظم الحشرات شاحباً أو أصفر أو مخضراً وليس أحمر؟' 
        },
        options: {
          en: [
            'It lacks hemoglobin (does not carry oxygen)',
            'Insects do not need oxygen at all',
            'Insect blood flows too fast to turn red',
            'Because the insect heart is too small'
          ],
          ar: [
            'لأنه يفتقر للهيموجلوبين ولا ينقل الأكسجين',
            'لأن الحشرات لا تحتاج للأكسجين نهائياً',
            'لأن الدم يجري بسرعة فائقة تمنع تلونه',
            'بسبب صغر حجم قلب الحشرة الشديد'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 10 & 14: Most insects lack hemoglobin in their hemolymph. Oxygen is supplied directly to cells through air tubes called tracheae!',
          ar: 'من الشرائح 10 و14: يفتقر الهيموليمف للهيموجلوبين ولا ينقل الأكسجين، حيث يصل الأكسجين للخلايا مباشرة عبر شبكة القصبات والشعيبات الهوائية (Tracheae).'
        }
      },
      {
        id: 'qq_2',
        question: { 
          en: 'How many chambers does a fish heart have, and what type of circulation does it perform?', 
          ar: 'كم عدد حجرات قلب الأسماك، وما نوع الدورة الدموية لديها؟' 
        },
        options: {
          en: [
            '2 chambers (1 atrium, 1 ventricle) - Single circulation',
            '3 chambers (2 atria, 1 ventricle) - Mixed circulation',
            '4 chambers (2 atria, 2 ventricles) - Double circulation',
            '1 single chamber with multiple pumps'
          ],
          ar: [
            'حجرتان (أذين وبطين واحد) - دورة دموية مفردة',
            '3 حجرات (أذينان وبطين) - دورة مختلطة',
            '4 حجرات (أذينان وبطينان) - دورة مزدوجة',
            'حجرة واحدة متصلة بأوعية جانبية'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 8: Fish hearts have only 2 chambers (1 atrium and 1 ventricle) creating a single circulation circuit from heart to gills to body.',
          ar: 'من الشريحة 8: تمتلك الأسماك قلباً من حجرتين فقط (أذين وبطين واحد)، وتمر الدورة الدموية في مسار مفرد من القلب للخياشيم ثم لباقي الجسم.'
        }
      },
      {
        id: 'qq_3',
        question: { 
          en: 'In which of the following organisms does blood remain strictly enclosed inside blood vessels (Closed System)?', 
          ar: 'أي من الكائنات الحية التالية يجري الدم داخل شبكة أوعية مغلقة بالكامل (جهاز دوري مغلق)؟' 
        },
        options: {
          en: [
            'Earthworms and all Vertebrates',
            'Grasshoppers and Cockroaches',
            'Spiders, Crabs, and Scorpions',
            'Clams and Garden Snails'
          ],
          ar: [
            'دودة الأرض وجميع الفقاريات (مثل الإنسان والطيور)',
            'الجراد والصراصير والنحل',
            'العناكب وسرطانات البحر والعقارب',
            'المحار وقواقع الحدائق'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 6 & 7: Earthworms, squids, and all vertebrates have closed circulatory systems where blood never leaves vessels, exchanging via capillaries.',
          ar: 'من الشرائح 6 و7: دودة الأرض والحبار وجميع الفقاريات تمتلك جهازاً دورياً مغلقاً يبقى فيه الدم داخل الأوعية والشعيرات الدموية دون أن يغمر التجاويف.'
        }
      },
      {
        id: 'qq_4',
        question: { 
          en: 'What is the main body cavity called where hemolymph directly bathes organs like a "bath"?', 
          ar: 'ماذا يسمى التجويف الرئيسي في جسم الحشرة الذي يغمر فيه الهيموليمف الأعضاء مثل "حوض الاستحمام"؟' 
        },
        options: {
          en: ['Hemocoel', 'Dorsal Aorta', 'Coelom', 'Tracheole'],
          ar: ['التجويف الدموي (Hemocoel)', 'الأورطة الظهرية', 'البلعوم التنفسي', 'الشعيبات الهوائية']
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 12: The Hemocoel is the primary body cavity in an open system where hemolymph leaves vessels and directly bathes tissues and organs.',
          ar: 'من الشريحة 12: التجويف الدموي (Hemocoel) هو التجويف الذي ينساب فيه سائل الهيموليمف ليغمر الأنسجة والأعضاء مباشرة لتبادل المواد.'
        }
      },
      {
        id: 'qq_5',
        question: { 
          en: 'What happens in an insect heart during diastole (relaxation)?', 
          ar: 'ماذا يحدث في قلب الحشرة (الوعاء الظهري) أثناء مرحلة الانبساط (Diastole)؟' 
        },
        options: {
          en: [
            'Ostia valves open and hemolymph enters the heart',
            'Ostia valves close and hemolymph shoots into the head',
            'The heart stops pumping for several minutes',
            'Blood turns red due to rapid oxygen absorption'
          ],
          ar: [
            'تفتح صمامات الأوستيا (Ostia) ليدخل الهيموليمف للقلب',
            'تغلق صمامات الأوستيا ويُدفع السائل نحو الرأس',
            'يتوقف القلب عن النبض لعدة دقائق متواصلة',
            'يتحول لون الهيموليمف إلى الأحمر فجأة'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 11: During diastole, lateral ostia valves open so hemolymph enters from the hemocoel. During systole (contraction), ostia close and fluid pumps forward!',
          ar: 'من الشريحة 11: أثناء الانبساط تفتح صمامات الأوستيا ليدخل الهيموليمف، وفي الانقباض (Systole) تقفل الصمامات ليُضخ السائل للأمام نحو الأورطة والرأس.'
        }
      },
      {
        id: 'qq_6',
        question: { 
          en: 'Why do insects have "Accessory Pulsatile Organs" in their head, antennae, or wings?', 
          ar: 'لماذا تمتلك بعض الحشرات "أعضاء نابضة مساعدة" (Accessory Pulsatile Organs) في الرأس أو الأجنحة أو الأرجل؟' 
        },
        options: {
          en: [
            'To boost low-pressure hemolymph into narrow extremities',
            'To generate body heat and fly at night',
            'To store extra oxygen reserves for diving underwater',
            'To produce digestive enzymes for tough food'
          ],
          ar: [
            'لضخ الهيموليمف في الزوائد الضيقة لضعف ضغط الجهاز المفتوح',
            'لتوليد حرارة في عضلات الصدر للطيران ليلاً',
            'لتخزين كميات احتياطية من الأكسجين تحت الماء',
            'لإفراز إنزيمات هاضمة للحبوب الصلبة'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 13: Because open systems operate under low pressure, accessory pulsatile organs act as local booster pumps to push fluid into long narrow wings, antennae, and legs.',
          ar: 'من الشريحة 13: نظراً لأن الجهاز المفتوح يتميز بضغط منخفض وتدفق بطيء، تعمل هذه الأعضاء كمضخات معززة لضخ السائل للأجنحة والقرون والأرجل.'
        }
      },
      {
        id: 'qq_7',
        question: { 
          en: 'Why is simple diffusion sufficient for an Amoeba, while animals need a circulatory system?', 
          ar: 'لماذا يكفي الانتشار البسيط (Simple Diffusion) للأميبا بينما تحتاج الحيوانات الكبيرة لجهاز دوري؟' 
        },
        options: {
          en: [
            'Amoeba has small size and large surface-area-to-volume ratio',
            'Amoeba has four tiny hearts inside its cytoplasm',
            'Diffusion in water is 1000x faster than in air',
            'Multicellular animals produce no cellular waste'
          ],
          ar: [
            'لأن الأميبا مجهرية وتملك مساحة سطح كبيرة بالنسبة لحجمها',
            'لأن الأميبا تحتوي على أربعة قلوب مجهرية داخل السيتوبلازم',
            'لأن الانتشار في الماء أسرع بآلاف المرات من الهواء',
            'لأن الحيوانات عديدة الخلايا لا تنتج أي فضلات'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 3 & 4: In unicellular organisms, diffusion distances are microscopic. In multicellular animals, diffusion is way too slow to supply interior cells!',
          ar: 'من الشريحتين 3 و4: صغر حجم الأميبا ومساحة سطحها الكبيرة تجعل الانتشار كافياً وسريعاً، بينما في الحيوانات الكبيرة يكون الانتشار بطيئاً جداً ولا يصل للخلايا العميقة.'
        }
      },
      {
        id: 'qq_8',
        question: { 
          en: 'What are the immune defense cells found floating in insect hemolymph called?', 
          ar: 'ماذا تسمى خلايا المناعة الدفاعية التي تسبح في سائل الهيموليمف لدى الحشرات؟' 
        },
        options: {
          en: ['Hemocytes', 'Erythrocytes', 'Platelets', 'Osteocytes'],
          ar: ['الهيموسايت (Hemocytes)', 'خلايا الدم الحمراء', 'الصفائح الدموية', 'الخلايا العظمية']
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 10: Hemolymph contains specialized immune cells called hemocytes that engulf pathogens and assist in wound healing.',
          ar: 'من الشريحة 10: يحتوي الهيموليمف على خلايا مناعية متخصصة تسمى Hemocytes تبتلع الجراثيم والميكروبات وتساعد في التئام الجروح.'
        }
      }
    ]
  },

  mysteryClue: {
    id: 'mysteryClue',
    title: { en: 'Mystery Clue', ar: 'اللغز الغامض' },
    icon: '🔍',
    color: '#FFCA3A',
    description: { 
      en: 'Detective mode! Guess the biological term from clues. Revealing extra clues costs assistance points!',
      ar: 'وضع المحقق الذكي! خمن المفهوم. كشف التلميحات الإضافية يخصم نقاط مساعدة!'
    },
    items: [
      {
        id: 'mc_1',
        title: { en: 'Mystery Fluid #1', ar: 'السائل الغامض #1' },
        clues: {
          en: [
            '🔍 Clue 1 (Free): I flow inside insects and crabs, but I lack red blood cells and hemoglobin.',
            '🔍 Clue 2 (Costs 5 Pts): I directly bathe all organs in a body cavity called the hemocoel like a warm bath.',
            '🔍 Clue 3 (Costs 5 Pts): I transport nutrients, hormones, waste, and immune cells, but NOT oxygen!'
          ],
          ar: [
            '🔍 التلميح 1 (مجاني): أجري داخل الحشرات والقشريات، ولكن لا أحتوي على كرات دم حمراء ولا هيموجلوبين.',
            '🔍 التلميح 2 (وسيلة مساعدة: -5 نقاط): أغمر وأسبح حول جميع الأعضاء الداخلية داخل تجويف يُدعى الـ Hemocoel.',
            '🔍 التلميح 3 (وسيلة مساعدة: -5 نقاط): أنقل المغذيات والهرمونات والفضلات، ولكنني معفى تماماً من نقل الأكسجين!'
          ]
        },
        options: {
          en: [
            'Hemolymph',
            'Human Plasma',
            'Digestive Acid',
            'Cytoplasm'
          ],
          ar: [
            'سائل الهيموليمف (Hemolymph)',
            'بلازما الدم البشري',
            'العصارة الهاضمة',
            'السيتوبلازم الخلوي'
          ]
        },
        correctIndex: 0,
        answer: { en: 'Hemolymph (سائل الهيموليمف)', ar: 'سائل الهيموليمف (Hemolymph)' },
        funFact: {
          en: 'Hemolymph makes up 20% to 40% of an insect\'s body weight!',
          ar: 'يشكل الهيموليمف ما بين 20% إلى 40% من وزن جسم الحشرة ويساعد في بسط الأجنحة!'
        }
      },
      {
        id: 'mc_2',
        title: { en: 'Mystery Highway System #2', ar: 'شبكة النقل الغامضة #2' },
        clues: {
          en: [
            '🔍 Clue 1 (Free): We are a complex branching network of silvery air tubes running throughout an insect.',
            '🔍 Clue 2 (Costs 5 Pts): We open to the external world through tiny side pores on the body called spiracles.',
            '🔍 Clue 3 (Costs 5 Pts): Because of us, insect hemolymph doesn\'t need to carry oxygen!'
          ],
          ar: [
            '🔍 التلميح 1 (مجاني): نحن شبكة معقدة ومتفرعة من الأنابيب الهوائية الدقيقة الممتدة في كامل جسم الحشرة.',
            '🔍 التلميح 2 (وسيلة مساعدة: -5 نقاط): نفتح على العالم الخارجي عبر ثغور تنفسية جانبية تسمى Spiracles.',
            '🔍 التلميح 3 (وسيلة مساعدة: -5 نقاط): بفضل وجودنا، لا تحتاج الحشرة لكرات دم حمراء لنقل الأكسجين!'
          ]
        },
        options: {
          en: [
            'Tracheal System (Tracheae & Tracheoles)',
            'Arterial Network',
            'Digestive Alimentary Canal',
            'Nervous Ventral Cord'
          ],
          ar: [
            'جهاز القصبات والشعيبات الهوائية (Tracheae)',
            'شبكة الشرايين المغلقة',
            'القناة الهضمية المعوية',
            'الحبل العصبي البطني'
          ]
        },
        correctIndex: 0,
        answer: { en: 'Tracheal System (القصبات الهوائية)', ar: 'جهاز القصبات والشعيبات الهوائية (Tracheae)' },
        funFact: {
          en: 'Tracheae bring oxygen directly to cell membranes with zero blood required!',
          ar: 'توصل القصبات الهوائية الأكسجين مباشرة للخلايا بدون أي وسيط دموي!'
        }
      },
      {
        id: 'mc_3',
        title: { en: 'Mystery Valve Gatekeepers #3', ar: 'حراس الصمامات الغامضة #3' },
        clues: {
          en: [
            '🔍 Clue 1 (Free): We are lateral slit-like openings located along the tubular insect heart.',
            '🔍 Clue 2 (Costs 5 Pts): We act as one-way valves that open wide when the heart expands (diastole).',
            '🔍 Clue 3 (Costs 5 Pts): When the heart contracts (systole), we snap shut so fluid pumps forward into the aorta!'
          ],
          ar: [
            '🔍 التلميح 1 (مجاني): نحن فتحات جانبية تشبه الشقوق على طول الوعاء القلبي للحشرة في البطن.',
            '🔍 التلميح 2 (وسيلة مساعدة: -5 نقاط): نعمل كصمامات باتجاه واحد، نفتح عند انبساط القلب (Diastole) ليدخل السائل.',
            '🔍 التلميح 3 (وسيلة مساعدة: -5 نقاط): عند انقباض القلب نغلق بإحكام ليُجبر السائل على الاندفاع للأمام نحو الأورطة!'
          ]
        },
        options: {
          en: [
            'Ostia Valves',
            'Capillary Pores',
            'Spiracles',
            'Venous Flaps'
          ],
          ar: [
            'صمامات وفتحات الأوستيا (Ostia)',
            'ثقوب الشعيرات الدموية',
            'الثغور التنفسية الخارجية',
            'الصمامات الوريدية الثلاثية'
          ]
        },
        correctIndex: 0,
        answer: { en: 'Ostia (صمامات الأوستيا)', ar: 'صمامات وفتحات الأوستيا (Ostia)' },
        funFact: {
          en: 'Ostia prevent regurgitation into the hemocoel during heart contraction.',
          ar: 'تمنع الأوستيا ارتداد السائل للتجويف البطني أثناء انقباض القلب لضمان سريانه للرأس.'
        }
      },
      {
        id: 'mc_4',
        title: { en: 'Mystery Organism #4', ar: 'الكائن الحي الغامض #4' },
        clues: {
          en: [
            '🔍 Clue 1 (Free): I am an invertebrate crawling through garden soil without bones.',
            '🔍 Clue 2 (Costs 5 Pts): Unlike insects, my circulatory system is CLOSED and blood travels in real vessels.',
            '🔍 Clue 3 (Costs 5 Pts): I have 5 pairs of pulsating aortic arches acting like pseudo-hearts!'
          ],
          ar: [
            '🔍 التلميح 1 (مجاني): أنا كائن لا فقاري أزحف في تربة الحدائق الرطبة وليس لدي أي عظام.',
            '🔍 التلميح 2 (وسيلة مساعدة: -5 نقاط): على عكس الحشرات، جهازي الدوري مغلق (Closed) ودمي يجري داخل أوعية دموية.',
            '🔍 التلميح 3 (وسيلة مساعدة: -5 نقاط): أمتلك 5 أزواج من الأقواس الأبهرية النابضة التي تعمل كقلوب بدائية!'
          ]
        },
        options: {
          en: [
            'The Earthworm',
            'The Grasshopper',
            'The Jellyfish',
            'The Garden Snail'
          ],
          ar: [
            'دودة الأرض (Earthworm)',
            'الجراد الصحراوي',
            'قنديل البحر',
            'حلزون الحدائق'
          ]
        },
        correctIndex: 0,
        answer: { en: 'The Earthworm (دودة الأرض)', ar: 'دودة الأرض (Earthworm)' },
        funFact: {
          en: 'Earthworms are the classic example of an invertebrate with a closed circulatory system!',
          ar: 'دودة الأرض هي المثال الكلاسيكي الأبرز للافقاريات التي تمتلك جهازاً دورياً مغلقاً!'
        }
      }
    ]
  },

  fixMistake: {
    id: 'fixMistake',
    title: { en: 'Fix the Mistake', ar: 'صحّح الخطأ' },
    icon: '❌',
    color: '#BA8DFF',
    description: { 
      en: 'Spot the scientific misconception and choose the correct scientific fix!',
      ar: 'حدد الخطأ العلمي في الجملة ثم اختر التصحيح الصحيح من الخيارات!'
    },
    items: [
      {
        id: 'fm_1',
        sentence: {
          en: '❌ "When you swat a mosquito and see red fluid, that is the insect\'s own red blood."',
          ar: '❌ "عندما تضرب بعوضة أو حشرة وتجد سائلاً أحمر، فهذا دم الحشرة الطبيعي."'
        },
        options: {
          en: [
            'Correction: Insects have no hemoglobin or red blood; the red fluid is vertebrate blood it sucked!',
            'Correction: Insects only have red blood on weekends',
            'Correction: Insect blood is always bright blue due to chlorophyll',
            'Correction: Only male mosquitoes have red blood'
          ],
          ar: [
            'التصحيح: الحشرات لا تملك هيموجلوبين أو دماً أحمر؛ والسائل الأحمر هو دم كائن فقاري امتصته البعوضة!',
            'التصحيح: الحشرات دمها أحمر فقط في عطلة نهاية الأسبوع',
            'التصحيح: دم الحشرات أزرق لامع دائماً لاحتوائه على مادة الكلوروفيل',
            'التصحيح: ذكور البعوض فقط هي التي تمتلك دماً أحمر'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Insects have colorless, pale yellow, or green hemolymph lacking hemoglobin. Any red blood comes from vertebrate hosts!',
          ar: 'هيموليمف الحشرات عديم اللون أو مصفر لغياب الهيموجلوبين. الدم الأحمر الذي تشاهده يخص العائل الذي لدغته البعوضة!'
        }
      },
      {
        id: 'fm_2',
        sentence: {
          en: '❌ "In an insect, hemolymph enters the aorta near the head and pumps backward into the abdomen."',
          ar: '❌ "في الحشرات، يدخل الهيموليمف من الأورطة عند الرأس ويُضخ للخلف باتجاه البطن."'
        },
        options: {
          en: [
            'Correction: Enters heart in abdomen via ostia and is pumped FORWARD to the head via aorta',
            'Correction: Fluid stays permanently stationary and never moves',
            'Correction: Hemolymph is pumped sideways out of the legs',
            'Correction: Fluid is sucked through the mouth and leaves through the tail'
          ],
          ar: [
            'التصحيح: السائل يدخل للقلب في البطن عبر الأوستيا ويُضخ للأمام (Anteriorly) عبر الأورطة نحو الرأس',
            'التصحيح: السائل ثابت في مكانه تماماً ولا يتحرك مطلقاً داخل الحشرة',
            'التصحيح: الهيموليمف يُضخ جانبياً إلى خارج الأرجل في الهواء',
            'التصحيح: السائل يمتص من الفم ويخرج من الذيل مباشرة'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 11: Heart is in the abdomen (posterior) and pumps hemolymph forward through the dorsal aorta into the head!',
          ar: 'من الشريحة 11: القلب يقع في البطن الخلفي ويضخ السائل للأمام عبر الأورطة نحو الرأس والصدر!'
        }
      },
      {
        id: 'fm_3',
        sentence: {
          en: '❌ "Amphibians like frogs have 4-chambered hearts that completely separate oxygenated and deoxygenated blood."',
          ar: '❌ "البرمائيات كالضفادع تمتلك قلباً من 4 حجرات يفصل تماماً بين الدم المؤكسج وغير المؤكسج."'
        },
        options: {
          en: [
            'Correction: Amphibians have only 3 chambers (2 atria, 1 ventricle) with partial mixing of blood',
            'Correction: Amphibians have 10 chambers arranged in a circle',
            'Correction: Amphibians have no heart and rely on simple diffusion',
            'Correction: Frogs have two completely separate hearts in each leg'
          ],
          ar: [
            'التصحيح: البرمائيات تملك 3 حجرات فقط (أذينان وبطين مشترك) مما يسبب بعض اختلاط الدم',
            'التصحيح: البرمائيات تملك 10 حجرات مرتبة دائرياً',
            'التصحيح: البرمائيات ليس لها قلب إطلاقاً وتعتمد على الانتشار البسيط',
            'التصحيح: الضفدع يملك قلبين منفصلين تماماً في كل رجل'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 8: Amphibians possess 3 chambers (2 atria, 1 ventricle) with blood mixing. Birds and mammals have 4 chambers.',
          ar: 'من الشريحة 8: قلب البرمائيات ثلاثي الحجرات (أذينان وبطين) ويحدث اختلاط للدم في البطين، وفقط الطيور والثدييات تملك 4 حجرات كاملة الفصل.'
        }
      },
      {
        id: 'fm_4',
        sentence: {
          en: '❌ "Single-celled Amoebas need a microscopic heart and blood vessels to survive."',
          ar: '❌ "الأميبا كائن وحيد الخلية يحتاج لقلب مجهري وشبكة أوعية دموية لينقل الغذاء."'
        },
        options: {
          en: [
            'Correction: Amoeba has NO circulatory system; simple diffusion across its membrane is enough!',
            'Correction: Amoeba has two tiny hearts in its nucleus',
            'Correction: Amoeba has closed blood vessels made of cellulose',
            'Correction: Amoeba breathes with gills like a fish'
          ],
          ar: [
            'التصحيح: الأميبا لا تملك أي جهاز دوري؛ والانتشار البسيط عبر غشائها كافٍ وسريع لصغر حجمها!',
            'التصحيح: الأميبا تحتوي على قلبين مجهريين داخل النواة',
            'التصحيح: الأميبا تملك أوعية دموية مغلقة مصنوعة من السليلوز',
            'التصحيح: الأميبا تتنفس بالخياشيم كالأسماك تماماً'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 4: Because of its microscopic size and large surface-area-to-volume ratio, diffusion alone supplies the Amoeba.',
          ar: 'من الشريحة 4: صغر حجم الأميبا ومساحة سطحها الكبيرة تجعل الانتشار البسيط كافياً تماماً دون الحاجة لجهاز دوري.'
        }
      },
      {
        id: 'fm_5',
        sentence: {
          en: '❌ "Open circulatory systems have higher pressure and faster blood speed than closed systems."',
          ar: '❌ "الجهاز الدوري المفتوح يتميز بضغط دم مرتفع وتدفق سريع جداً مقارنة بالجهاز المغلق."'
        },
        options: {
          en: [
            'Correction: Open systems have LOWER pressure and SLOWER flow because fluid enters an open hemocoel cavity',
            'Correction: Both systems have identical pressure of 200 PSI',
            'Correction: Open systems pump blood at the speed of sound',
            'Correction: Closed systems have zero pressure because vessels are thin'
          ],
          ar: [
            'التصحيح: النظام المفتوح ضغطه منخفض وتدفقه أبطأ لأن السائل ينساب في تجويف مفتوح واسع (Hemocoel)',
            'التصحيح: النظامان لهما نفس الضغط المتطابق تماماً بدون أي فارق',
            'التصحيح: النظام المفتوح يضخ الدم بسرعة الصوت',
            'التصحيح: النظام المغلق ضغطه صفر لأن الأوعية رقيقة'
          ]
        },
        correctIndex: 0,
        explanation: {
          en: 'Slide 5, 6, & 15: Closed systems maintain high pressure and fast flow. Open systems operate under low pressure and slow flow.',
          ar: 'من الشرائح 5 و6 و15: النظام المغلق يتميز بضغط مرتفع وتدفق سريع وموجه، بينما النظام المفتوح ضغطه منخفض وتدفقه أبطأ.'
        }
      }
    ]
  },

  actItOut: {
    id: 'actItOut',
    title: { en: 'Act It Out', ar: 'مثّلها بدون كلام' },
    icon: '🎭',
    color: '#4CC9F0',
    description: { 
      en: 'Theatrical biology challenge! Evaluated exclusively by the Admin/Presenter.',
      ar: 'التحدي المسرحي الصامت! يتم تقييم أداء الفريق ومنح النقاط حصرياً من قِبل المشرف.'
    },
    items: [
      {
        id: 'aio_1',
        prompt: {
          en: 'Act out Slide 3\'s Traffic Metaphor: First act as chaotic traffic in an open square (cars crashing everywhere with no lanes), then suddenly become a smooth train running on strict railway tracks (closed system)!',
          ar: 'مثّل تشبيه الشريحة 3 (تنظيم المرور): في البداية مثّل سيارات في ميدان مفتوح بلا إشارات تتصادم وتتزاحم (نظام مفتوح)، ثم تحوّل لقطار منظم يجري على قضبان محددة وسريعة (نظام مغلق)!'
        },
        secretKeyword: { en: 'Traffic Chaos vs Smooth Train (تشبيه تنظيم المرور)', ar: 'فوضى السيارات مقابل القطار المنظم' },
        timeLimitSeconds: 45
      },
      {
        id: 'aio_2',
        prompt: {
          en: 'Act as an insect\'s dorsal heart: Expand your chest to open the ostia and suck in hemolymph, then squeeze tight and shoot the fluid forward out of your head like a squirt gun!',
          ar: 'مثّل قلب الحشرة الظهرية: انفخ صدرك وافتح يديك لتفتح صمامات الأوستيا وتمتص السائل، ثم انقبض بقوة وأطلق السائل من قمة رأسك للأمام كالمدفع المائي!'
        },
        secretKeyword: { en: 'Insect Heart Pumping Forward (نبض قلب الحشرة للأمام)', ar: 'نبض قلب الحشرة للأمام' },
        timeLimitSeconds: 45
      },
      {
        id: 'aio_3',
        prompt: {
          en: 'You are an oxygen molecule trying to jump onto a lazy insect hemolymph cell, but the hemolymph pushes you away yelling silently: "Go to the Tracheae air tubes! I don\'t transport oxygen!"',
          ar: 'أنت جزيء أكسجين تحاول الركوب على خلية هيموليمف، لكن الهيموليمف يطردك ويشير لك بيده بغضب: "اذهب إلى القصبات الهوائية! أنا لا أحمل الأكسجين!"'
        },
        secretKeyword: { en: 'Oxygen Rejected by Hemolymph (طرد الأكسجين من الهيموليمف)', ar: 'طرد الأكسجين من الهيموليمف' },
        timeLimitSeconds: 45
      },
      {
        id: 'aio_4',
        prompt: {
          en: 'Act as a tiny Amoeba absorbing food peacefully, then suddenly imagine growing 1,000 times bigger, gasping for air because diffusion is too slow, and frantically trying to build a circulatory heart!',
          ar: 'مثّل أميبا مجهرية هادئة تمتص الغذاء براحة، ثم فجأة تتخيل نفسك تتضخم لـ 1000 ضعف وتختنق لأن الانتشار بطيء جداً، وتصرخ بحثاً عن قلب وأوعية دموية!'
        },
        secretKeyword: { en: 'Amoeba Diffusion Panic (ورطة تضخم الأميبا)', ar: 'ورطة تضخم الأميبا' },
        timeLimitSeconds: 45
      },
      {
        id: 'aio_5',
        prompt: {
          en: 'Act as an Accessory Pulsatile Organ at the base of an insect\'s wing: On a chilly morning, you are frantically pumping with your arms to push hemolymph into the stiff wing so the insect can fly!',
          ar: 'مثّل العضو النابض المساعد (Accessory Pump) عند قاعدة جناح الحشرة: في صباح بارد تقوم بالضخ بسرعة وشدة بيديك لتدفع السائل إلى داخل الجناح ليتمكن الصرصور من الطيران!'
        },
        secretKeyword: { en: 'Accessory Wing Booster Pump (المضخة المساعدة في الجناح)', ar: 'المضخة المساعدة في الجناح' },
        timeLimitSeconds: 45
      }
    ]
  },

  explainItFast: {
    id: 'explainItFast',
    title: { en: 'Explain It Fast', ar: 'اشرحها بسرعة' },
    icon: '⏱️',
    color: '#8AC926',
    description: { 
      en: '30-second rapid taboo challenge! Evaluated exclusively by the Admin/Presenter.',
      ar: 'تحدي الكلمات المحظورة في 30 ثانية! يتم تقييم نجاح الفريق في تجنب الكلمات الممنوعة حصرياً من قِبل المشرف.'
    },
    items: [
      {
        id: 'eif_1',
        targetWord: { en: 'Hemolymph (سائل الهيموليمف)', ar: 'سائل الهيموليمف' },
        forbiddenWords: {
          en: ['Blood', 'Insect', 'Red', 'Liquid'],
          ar: ['دم', 'حشرة', 'أحمر', 'سائل']
        },
        timeLimitSeconds: 30
      },
      {
        id: 'eif_2',
        targetWord: { en: 'Open Circulatory System (الجهاز الدوري المفتوح)', ar: 'الجهاز الدوري المفتوح' },
        forbiddenWords: {
          en: ['Vessels', 'Closed', 'Bathes', 'Artery'],
          ar: ['أوعية', 'مغلق', 'يغمر', 'شريان']
        },
        timeLimitSeconds: 30
      },
      {
        id: 'eif_3',
        targetWord: { en: 'Tracheae (القصبات الهوائية)', ar: 'القصبات الهوائية' },
        forbiddenWords: {
          en: ['Oxygen', 'Air', 'Tubes', 'Breathe'],
          ar: ['أكسجين', 'هواء', 'أنابيب', 'تنفس']
        },
        timeLimitSeconds: 30
      },
      {
        id: 'eif_4',
        targetWord: { en: 'Hemocoel (التجويف الدموي)', ar: 'التجويف الدموي (Hemocoel)' },
        forbiddenWords: {
          en: ['Cavity', 'Body', 'Bath', 'Inside'],
          ar: ['تجويف', 'جسم', 'حوض / حمام', 'داخل']
        },
        timeLimitSeconds: 30
      },
      {
        id: 'eif_5',
        targetWord: { en: 'Ostia (فتحات الأوستيا)', ar: 'فتحات وصمامات الأوستيا (Ostia)' },
        forbiddenWords: {
          en: ['Valves', 'Holes', 'Heart', 'Diastole'],
          ar: ['صمامات', 'فتحات / ثقوب', 'قلب', 'انبساط']
        },
        timeLimitSeconds: 30
      },
      {
        id: 'eif_6',
        targetWord: { en: 'Capillaries (الشعيرات الدموية)', ar: 'الشعيرات الدموية' },
        forbiddenWords: {
          en: ['Thin', 'Exchange', 'Vessels', 'Walls'],
          ar: ['رقيقة', 'تبادل', 'أوعية', 'جدار']
        },
        timeLimitSeconds: 30
      }
    ]
  },

  luckyBug: {
    id: 'luckyBug',
    title: { en: 'Lucky Bug', ar: 'حشرة الحظ السعيدة' },
    icon: '⭐',
    color: '#8E7DBE',
    description: { 
      en: 'Biology surprise cards! Special superpowers, point steals, and presentation bonuses.',
      ar: 'بطاقات بيولوجية مفاجئة! قوى الحشرات الخارقة، سرقة نقاط، ومكافآت البرزنتيشن.'
    },
    items: [
      {
        id: 'lb_1',
        title: { en: 'Cockroach Survival Superpower! 🪳', ar: 'قدرة الصرصور الخارقة على البقاء! 🪳' },
        reward: { en: '+50 Bonus Points!', ar: '+50 نقطة إضافية لفريقك فوراً!' },
        effect: 'points_50',
        detail: { 
          en: 'Cockroaches can live for weeks without their head because their open circulatory system does not rapidly bleed out, and they breathe through body spiracles! Take +50 points!',
          ar: 'تستطيع الصراصير العيش لأسابيع دون رأسها لأن جهازها الدوري المفتوح منخفض الضغط لا يسبب نزيفاً سريعاً، وتتنفس من ثغور جسمها! ينال فريقك 50 نقطة!'
        }
      },
      {
        id: 'lb_2',
        title: { en: 'Accessory Booster Pump! ⚡', ar: 'المضخة النابضة المساعدة! ⚡' },
        reward: { en: 'Steal 20 Points from the Rival Team!', ar: 'اسرق 20 نقطة من رصيد الفريق المنافس!' },
        effect: 'steal_20',
        detail: { 
          en: 'Just like accessory pulsatile organs boost low-pressure hemolymph into the wings, you boost your team score by transferring 20 points from the leader!',
          ar: 'كما تعزز الأعضاء النابضة تدفق السائل للأجنحة والقرون، عزز رصيدك بنقل 20 نقطة من الفريق المنافس المتصدر إلى رصيدكم!'
        }
      },
      {
        id: 'lb_3',
        title: { en: 'Double Circulation Super Spin! 🦅', ar: 'الدورة الدموية المزدوجة الفائقة! 🦅' },
        reward: { en: 'Spin the Wheel Again with 2X Points!', ar: 'أعد تدوير العجلة فوراً مع مضاعفة نقاط النشاط التالي (2X)!' },
        effect: 'free_spin',
        detail: { 
          en: 'Like birds and mammals with a 4-chambered heart and double circulation, take a second spin with double reward points!',
          ar: 'كالطيور والثدييات ذات القلب رباعي الحجرات والدورة الدموية المزدوجة، يحق لفريقكم تدوير العجلة فوراً مع مضاعفة نقاط التحدي القادم!'
        }
      },
      {
        id: 'lb_4',
        title: { en: 'The Tracheal Breath-Hold Challenge! 🫁', ar: 'تحدي حبس الأنفاس القصبي! 🫁' },
        reward: { en: '+30 Points if your team holds breath for 10 seconds!', ar: '+30 نقطة إذا حبس أعضاء فريقكم أنفاسهم لمدة 10 ثوانٍ!' },
        effect: 'applause',
        detail: { 
          en: 'Insects breathe without lungs or red blood cells! Can your team stand up and hold their breath for 10 seconds to earn 30 points?',
          ar: 'تتنفس الحشرات بالقصبات دون رئة ودون كرات دم حمراء! هل يستطيع فريقكم حبس أنفاسه لـ 10 ثوانٍ جماعياً لكسب 30 نقطة إضافية؟'
        }
      },
      {
        id: 'lb_5',
        title: { en: 'Ostia One-Way Shield! 🛡️', ar: 'درع صمامات الأوستيا أحادي الاتجاه! 🛡️' },
        reward: { en: 'Immunity Shield: Zero penalty on your next turn!', ar: 'درع الحماية: إلغاء أي خسارة نقاط إذا أخطأتم في السؤال القادم!' },
        effect: 'shield',
        detail: { 
          en: 'Just like ostia valves prevent backflow of hemolymph, this shield protects your team from losing points if you fail any future challenge!',
          ar: 'كما تمنع صمامات الأوستيا ارتداد السائل للخلف، يمنع هذا الدرع خسارة أي نقطة في حال تعثر فريقكم في أي سؤال قادم!'
        }
      }
    ]
  }
};

class ActivityManager {
  constructor() {
    this.storageKey = 'ladybug_circulatory_presentation_v5';
    this.language = localStorage.getItem('ladybug_lang') || 'ar';
    this.activities = this.loadActivities();
  }

  loadActivities() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...CIRCULATORY_ACTIVITIES, ...parsed };
      }
    } catch (e) {
      console.warn('Using default circulatory activities', e);
    }
    return JSON.parse(JSON.stringify(CIRCULATORY_ACTIVITIES));
  }

  saveActivities() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.activities));
    } catch (e) {
      console.error('Failed to save activities', e);
    }
  }

  resetToDefaults() {
    this.activities = JSON.parse(JSON.stringify(CIRCULATORY_ACTIVITIES));
    localStorage.removeItem(this.storageKey);
  }

  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem('ladybug_lang', lang);
  }

  getLanguage() {
    return this.language;
  }

  getActivity(activityKey) {
    return this.activities[activityKey];
  }

  getAllItems(activityKey) {
    const act = this.activities[activityKey];
    return act ? act.items : [];
  }

  getRandomItem(activityKey) {
    const act = this.activities[activityKey];
    if (!act || !act.items || act.items.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * act.items.length);
    return {
      item: act.items[randomIndex],
      index: randomIndex,
      total: act.items.length
    };
  }

  addItem(activityKey, item) {
    if (this.activities[activityKey]) {
      if (!item.id) item.id = 'custom_' + Date.now();
      this.activities[activityKey].items.push(item);
      this.saveActivities();
      return true;
    }
    return false;
  }

  deleteItem(activityKey, itemId) {
    if (this.activities[activityKey]) {
      this.activities[activityKey].items = this.activities[activityKey].items.filter(it => it.id !== itemId);
      this.saveActivities();
      return true;
    }
    return false;
  }
}

window.activityManager = new ActivityManager();
