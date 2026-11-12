import {
  RoomState,
  Player,
  GameType,
  BuzzerQuestionItem,
  DoodleStroke,
  ReactionType,
  FloatingReaction,
  QuickVoiceEvent,
  ItemCardType,
  TurtleSoupSuspect,
  PartyAward,
  PartyCeremonyState,
} from '../types/game.js';

import { UNDERCOVER_PAIRS, type UndercoverPair } from './undercoverPairs.js';
export { UNDERCOVER_PAIRS, type UndercoverPair };


export const DOODLE_PROMPTS = [
  // 简练清晰的 2~4 字经典与爆笑词条
  { prompt: '猫咪偷吃', category: '萌宠搞笑', coreWords: ['猫', '偷吃'] },
  { prompt: '程序员秃头', category: '打工百态', coreWords: ['程序员', '秃头'] },
  { prompt: '奥特曼打怪兽', category: '名场面', coreWords: ['奥特曼', '怪兽'] },
  { prompt: '火锅翻了', category: '悲剧瞬间', coreWords: ['火锅', '翻'] },
  { prompt: '恐龙穿裙子', category: '脑洞大开', coreWords: ['恐龙', '裙子'] },
  { prompt: '猛男撒娇', category: '人类迷惑', coreWords: ['猛男', '撒娇'] },
  { prompt: '偷看手机', category: '生活日常', coreWords: ['手机', '偷看'] },
  { prompt: '西瓜雪糕', category: '吃货狂喜', coreWords: ['西瓜', '雪糕'] },
  { prompt: '外卖小哥', category: '日常职业', coreWords: ['外卖', '小哥'] },
  { prompt: '熬夜黑眼圈', category: '打工百态', coreWords: ['熬夜', '黑眼圈'] },
  { prompt: '河马跳舞', category: '搞笑动物', coreWords: ['河马', '跳舞'] },
  { prompt: '煎蛋烤糊了', category: '厨房翻车', coreWords: ['煎蛋', '糊'] },
  { prompt: '踩香蕉皮摔跤', category: '爆笑动作', coreWords: ['香蕉', '摔跤'] },
  { prompt: '打雷捂耳朵', category: '生动场景', coreWords: ['打雷', '耳朵'] },
  { prompt: '吃柠檬酸哭', category: '吃货表情', coreWords: ['柠檬', '哭'] },
  { prompt: '大肚腩啤酒', category: '生活日常', coreWords: ['肚子', '啤酒'] },
  { prompt: '超级玛丽踩蘑菇', category: '游戏名梗', coreWords: ['玛丽', '蘑菇'] },
  { prompt: '狗子拆家', category: '萌宠搞笑', coreWords: ['狗', '拆家'] },
  { prompt: '排队上厕所', category: '人间真实', coreWords: ['排队', '厕所'] },
  { prompt: '放屁被发现了', category: '尴尬瞬间', coreWords: ['放屁', '发现'] },
];

export const BUZZER_QUESTIONS: BuzzerQuestionItem[] = [
  // 1. 脑筋急转弯
  {
    question: '一头猪在雪地里走，回头为什么看不到自己的脚印？',
    options: ['因为雪下得太大掩盖了', '因为它是倒着走的', '因为猪蹄太轻没留印', '因为它戴了鞋套'],
    correctIndex: 1,
    explanation: '脑筋急转弯：既然是倒着走的，脚印当然在它前面，回头自然看不到！',
  },
  {
    question: '树上有10只鸟，猎人开枪打死1只，树上还剩几只？',
    options: ['9只', '1只', '0只（全吓跑了）', '8只'],
    correctIndex: 2,
    explanation: '枪声一响，剩下的鸟全被惊飞啦，打死的那只也掉下来了，所以是0只！',
  },
  {
    question: '小王把手伸进装满油的铁锅里，为什么一点事都没有？',
    options: ['他练过铁砂掌', '油锅根本还没点火加热', '他戴了隐形手套', '锅里装的是凉水'],
    correctIndex: 1,
    explanation: '题目只说装满油，又没说油烧热了！仔细审题呀！',
  },
  {
    question: '在一年之中，哪一个月有28天？',
    options: ['只有2月', '闰年的2月', '每个月都有28天', '以上都不对'],
    correctIndex: 2,
    explanation: '一年12个月，哪个月不是从1号走到28号的？每个月都包含28天！',
  },
  {
    question: '什么东西越洗越脏，不洗反而很干净？',
    options: ['抹布', '水', '肥皂', '白衬衫'],
    correctIndex: 1,
    explanation: '清水用来洗别的东西，水自己就变脏了！',
  },
  {
    question: '医生给了你3颗药丸，嘱咐你每半小时吃1颗，吃完总共需多长时间？',
    options: ['1个半小时（90分钟）', '1个小时（60分钟）', '45分钟', '2个小时'],
    correctIndex: 1,
    explanation: '第0分钟吃第1颗，第30分钟吃第2颗，第60分钟吃第3颗，刚好1小时！',
  },
  {
    question: '参加马拉松比赛时，你奋力追赶并超过了第2名，请问你现在是第几名？',
    options: ['第1名', '第2名', '第3名', '并列第1名'],
    correctIndex: 1,
    explanation: '你超过了第2名，自然就取代了他的位置成为第2名，第1名还在你前头呢！',
  },
  // 2. 诗词歌赋
  {
    question: '“春蚕到死丝方尽，蜡炬成灰泪始干”出自哪位唐代诗人之手？',
    options: ['李商隐', '杜牧', '白居易', '李贺'],
    correctIndex: 0,
    explanation: '出自唐代诗人李商隐的代表作《无题·相见时难别亦难》。',
  },
  {
    question: '苏轼词句“大江东去，浪淘尽，千古风流人物”描写的是哪座著名历史古战场？',
    options: ['赤壁', '虎牢关', '官渡', '淝水'],
    correctIndex: 0,
    explanation: '出自苏轼《念奴娇·赤壁怀古》，借赤壁之战抒发旷达豪迈之情。',
  },
  {
    question: '“停车坐爱枫林晚，霜叶红于二月花”描写的季节是？',
    options: ['初春', '盛夏', '深秋', '隆冬'],
    correctIndex: 2,
    explanation: '霜叶红于二月花，描写的是深秋霜打枫林、红叶似火的绝美景象。',
  },
  {
    question: '中国古代神话中，“精卫填海”里的精卫鸟，传说原本是谁的女儿？',
    options: ['炎帝', '黄帝', '蚩尤', '伏羲'],
    correctIndex: 0,
    explanation: '《山海经》记载，炎帝幼女女娃溺于东海，化为精卫鸟，常衔西山木石填于东海。',
  },
  // 3. 生活常识与百科
  {
    question: '炒菜时不小心起火油锅着火了，最正确的扑救方式是？',
    options: ['迅速浇一盆冷水', '迅速盖上锅盖切断空气', '用扇子用力扇灭', '端起油锅往水槽倒'],
    correctIndex: 1,
    explanation: '水遇沸油会瞬间剧烈汽化并炸溅油火！必须立刻盖上锅盖窒息灭火并关火。',
  },
  {
    question: '人体最大的消化腺器官是哪个？',
    options: ['胃', '肝脏', '胰腺', '小肠'],
    correctIndex: 1,
    explanation: '肝脏是人体最大的内脏器官兼消化腺，成人的肝脏平均重达1.5公斤左右。',
  },
  {
    question: '在正常标准大气压下，水沸腾的温度是多少摄氏度？',
    options: ['90℃', '98℃', '100℃', '120℃'],
    correctIndex: 2,
    explanation: '标准大气压下纯水的沸点为100℃，而在高海拔低气压地区沸点会降低。',
  },
  {
    question: '被蚊子叮咬后皮肤起包发痒，主要是因为蚊子唾液中含有哪种物质引起的过敏？',
    options: ['甲酸与抗凝血蛋白', '酒精', '辣椒素', '柠檬酸'],
    correctIndex: 0,
    explanation: '蚊子刺叮时注入抗凝血抗原物质，人体免疫系统释放组胺导致局部红肿瘙痒。',
  },
  {
    question: '平时我们说的“黑天鹅事件”，通常指代什么样的事情？',
    options: ['非常吉利的大喜事', '极其罕见却影响重大的突发事件', '天气剧烈降温', '金融市场稳健盈利'],
    correctIndex: 1,
    explanation: '黑天鹅事件通常具备三个特征：意外性、产生极大冲击波、事后具有可解释性。',
  },
  {
    question: '金庸武侠小说《天龙八部》中，“六脉神剑”是大理段氏哪个寺院的镇寺绝技？',
    options: ['少林寺', '天龙寺', '悬空寺', '相国寺'],
    correctIndex: 1,
    explanation: '大理皇家寺院天龙寺（又称崇圣寺）的镇寺绝学即为六脉神剑。',
  },
];

export const PENALTY_WHEEL_ITEMS = [
  '【线上群聊】在好友群发一张搞怪自拍并配文“这就是天选之子”',
  '【语言表达】用播音腔深情朗读一段手机垃圾广告短信',
  '【社交大冒险】把微信/群头像换成AI刚才画的抽象图10分钟',
  '【声线模仿】模仿一种动物叫声直到全场猜出为止',
  '【连麦/现场】对身旁或连麦列表中一位好友深情说一句土味情话',
  '【体能考验】做5个深蹲，每蹲一次大喊一声“我是大聪明”',
  '【中二出击】学唐老鸭的嗓音宣布“今晚下顿聚会夜宵我请客”',
  '【语音轰炸】在群聊里连发3条中二动漫热血台词语音',
];

export const TRUTH_OR_DARE_PENALTIES = [
  {
    type: 'TRUTH' as const,
    title: '真心话 · 终极拷问',
    badge: '🤐',
    content: '坦白你做过最丢脸、至今想起来依然脚趾抠地的一件事！',
  },
  {
    type: 'TRUTH' as const,
    title: '真心话 · 情感大起底',
    badge: '💌',
    content: '说出你手机聊天置顶第一位的人是谁，并公开你们最近的一条消息！',
  },
  {
    type: 'TRUTH' as const,
    title: '真心话 · 现实扎心',
    badge: '💸',
    content: '你银行卡/微信余额里现在还有多少钱？上个月冲动消费买过最没用的东西是什么？',
  },
  {
    type: 'TRUTH' as const,
    title: '真心话 · 朋友圈破防',
    badge: '📱',
    content: '现场翻开你的朋友圈相册，随机翻到第10张照片念出当时的配文！',
  },
  {
    type: 'DARE' as const,
    title: '大冒险 · 搞怪自拍',
    badge: '📸',
    content: '摆出一个最油腻霸总或最呆萌的表情自拍，发到当前聚会群里！',
  },
  {
    type: 'DARE' as const,
    title: '大冒险 · 破音表白',
    badge: '🎤',
    content: '闭上眼睛原地转3圈，然后对左手边的朋友大声深情表白30秒！',
  },
  {
    type: 'DARE' as const,
    title: '大冒险 · 猛男下蹲',
    badge: '🏋️',
    content: '现场做5个俯卧撑或深蹲，每做一个必须大喊一声“我是宇宙无敌大聪明”！',
  },
  {
    type: 'DARE' as const,
    title: '大冒险 · 微信动态',
    badge: '🔥',
    content: '发一条朋友圈：“刚刚算命说我三天内会暴富，大家准备好随份子吧”，保留5分钟！',
  },
];


export const TURTLE_SOUP_PRESETS = [
  {
    title: '半根火柴',
    face: '一个男人赤身裸体死在茫茫荒漠中，手里紧紧攥着半根折断的火柴。周围没有任何车痕或脚印。他是怎么死的？',
    bottom: '他和同伴乘坐的热气球在荒漠上空发生故障急速下坠。为了减轻重量，大家扔掉了所有行李并脱光了衣服，但依然超重。最后大家抽火柴决定谁跳下去牺牲，他抽中了那根折断的短火柴，跳下高空摔死。',
    keywords: ['热气球', '减重', '抽签'],
    quickQuestions: [
      '他是自己走路进入荒漠的吗？',
      '他是被人谋杀害死的吗？',
      '当时现场还有其他同伴吗？',
      '他脱光衣服是出于自愿吗？',
      '手里的火柴是用来点火取暖的吗？',
    ],
    deepQuestions: [
      '他是从高空交通工具上掉下来的吗？',
      '他们乘坐的是热气球或飞艇吗？',
      '脱掉衣服是为了给载具减轻重量吗？',
      '半根火柴是用来抽签决定谁跳下去的吗？',
    ],
    solvePrompts: [
      '① 死者为什么会出现在没有脚印的荒漠里？（高空热气球/飞艇失事）',
      '② 死者为什么全身赤裸？（为了给下坠载具减轻重量扔掉衣物）',
      '③ 手里半根折断的火柴是怎么回事？（生死抽签抽中短火柴跳下牺牲）',
    ],
    clues: [
      '提示一（空间方向）：死者周围没有脚印，说明他不是从地面走进去的，请抬头往高空想！',
      '提示二（反常行为）：当时不止他一人，大家脱掉衣服和扔行李是为了给某个正在下坠的载具“减轻重量”。',
      '提示三（核心物证）：减重后依然超重，手里的半根短火柴是同行者之间“生死抽签”的工具！',
    ],
    suspects: [
      {
        id: 's1',
        name: '幸存旅伴 · 阿杰',
        role: '神色慌张的同行者',
        avatar: '🧔',
        statement: '别问我...那趟旅程本来在云端看风景很顺利，直到半空中突然传来漏气的撕裂声...',
        secretAlibi: '当时我们的吊篮在荒漠上空急速下坠！为了保命，大家把所有行李甚至身上的衣服全脱掉扔下去了，可还是超重...火柴盒是我拿出来让大家抽签的！',
        interrogated: false,
      },
      {
        id: 's2',
        name: '气象站长 · 老周',
        role: '荒漠前沿观测员',
        avatar: '👴',
        statement: '案发当天荒漠地面风平浪静，但三千米高空的气压却很不寻常。',
        secretAlibi: '那天雷达监测到荒漠高空气流剧烈失压，有一架轻型观光热气球在空中失去了升力，随后迅速从高空高度表上消失了。',
        interrogated: false,
      },
      {
        id: 's3',
        name: '法医队长 · 铁男',
        role: '重案勘查专家',
        avatar: '👮',
        statement: '死者身上没有任何搏斗或刀枪外伤，死因非常直接但极其罕见。',
        secretAlibi: '尸体下方的沙地有一个巨大的高空垂直坠落冲击坑，全身多处高空坠落骨折；他右手死死攥着半截没有划燃过的断火柴。',
        interrogated: false,
      },
    ],
  },
  {
    title: '酒吧里的枪声',
    face: '一个男人走进一家酒吧，礼貌地向酒保要一杯水。酒保却突然从吧台下掏出一把猎枪对准他！男人愣了两秒，随后微笑着说“谢谢你”，然后转身离开了。为什么？',
    bottom: '这个男人当时正在剧烈打嗝，他去酒吧要水是为了止嗝。经验丰富的酒保看出来了，故意突然掏枪吓他一跳。男人受到惊吓后打嗝立刻治好了，因此诚恳致谢后离开。',
    keywords: ['打嗝', '惊吓', '止嗝'],
    quickQuestions: [
      '酒保和男人之前认识或有仇吗？',
      '酒保掏枪是想伤害或抢劫他吗？',
      '男人进酒吧时身体有什么异常吗？',
      '酒保掏枪其实是出于好意帮他吗？',
      '男人最后还需要喝那杯水吗？',
    ],
    deepQuestions: [
      '男人要水喝是为了缓解某种生理小毛病吗？',
      '酒保掏枪是为了故意吓他一跳吗？',
      '男人当时正在剧烈打嗝吗？',
      '受到惊吓后他的打嗝被治好了吗？',
    ],
    solvePrompts: [
      '① 男人进酒吧要水喝的真正原因是什么？（他当时正在剧烈打嗝，想喝水止嗝）',
      '② 酒保为什么突然掏枪指着他，男人又为何道谢？（酒保故意吓他一跳帮他治好了打嗝）',
    ],
    clues: [
      '提示一（动机排查）：酒保与男人素不相识，掏枪没有任何恶意，反而是为了帮男人解决一个麻烦。',
      '提示二（身体异常）：男人进门说话时一抽一抽的，人们通常有两种土办法解决这个小毛病：喝水，或者受惊吓。',
      '提示三（核心真相）：男人当时在剧烈“打嗝”，酒保掏枪吓了他一跳，直接把他的打嗝吓没了！',
    ],
    suspects: [
      {
        id: 's1',
        name: '老牌酒保 · 托尼',
        role: '三十年调酒老手',
        avatar: '🤠',
        statement: '我调酒三十年，客人一进门张嘴，我就知道他缺的不是水，而是一剂猛药。',
        secretAlibi: '那家伙进门时胸口一抽一抽的，说一句话卡顿三次。对付这种让人难受的生理小毛病，突然掏枪吓唬他一下比喝白开水管用十倍！',
        interrogated: false,
      },
      {
        id: 's2',
        name: '微醺酒客 · 老李',
        role: '吧台邻座目击者',
        avatar: '🍺',
        statement: '当时可把我吓坏了，但那个男人的反应却比我还奇怪！',
        secretAlibi: '托尼把猎枪拍在吧台上指着他时，那男人浑身猛地一抖屏住了呼吸，过了两秒他发现自己胸口不抽搐了，笑得特别轻松！',
        interrogated: false,
      },
      {
        id: 's3',
        name: '驻唱女郎 · 露西',
        role: '酒吧爵士歌手',
        avatar: '💃',
        statement: '他在门口排练室路过时，我就听见他一路发出古怪的声音。',
        secretAlibi: '那个男人进门前一直捂着胸口憋气，脸色涨红，每隔几秒钟喉咙里就会不受控制地发出“嗝——”的一声响。',
        interrogated: false,
      },
    ],
  },
  {
    title: '深夜敲门声',
    face: '暴风雨之夜，一名守塔人独自在海岸灯塔值班。半夜门外传来急促的撞门声，他开门查看却空无一人。第二天清晨，一艘远洋轮船在附近海面触礁沉没。为什么？',
    bottom: '暴风雨之夜，迷失方向的海鸟撞击了灯塔门窗，同时强风故障导致灯塔顶部的导航主灯熄灭。守塔人下楼开门查看撞门声时未能及时发现并修复熄灭的导航灯，导致远洋轮船在黑暗中看不见灯塔指引而触礁沉没。',
    keywords: ['海鸟', '熄灭', '导航'],
    quickQuestions: [
      '半夜敲门的是人类吗？',
      '有人蓄意谋杀或破坏灯塔吗？',
      '轮船沉没跟灯塔的灯光有关吗？',
      '半夜撞门的是某种动物吗？',
      '灯塔顶部的导航灯当时熄灭了吗？',
    ],
    deepQuestions: [
      '撞门的是暴风雨中迷航的海鸟吗？',
      '轮船是因为看不见灯塔灯光才触礁的吗？',
      '守塔人开门查看时忽略了顶部熄灭的主灯吗？',
    ],
    solvePrompts: [
      '① 半夜急促的撞门声究竟是什么发出的？（暴风雨中迷航的海鸟/飞鸟撞门）',
      '② 远洋轮船为什么会在附近海面触礁沉没？（灯塔顶部导航主灯熄灭，轮船看不见灯光指引而触礁）',
    ],
    clues: [
      '提示一（撞门真相）：暴风雨中的孤岛灯塔没有别人，撞门的不是人类，而是空中被狂风吹偏的生物。',
      '提示二（灯塔职责）：守塔人最重要的职责是确保塔顶的旋转导航灯整夜长明。',
      '提示三（核心因果）：迷航的“海鸟”撞击了门窗，而此时塔顶“导航主灯故障熄灭”，轮船在海上看不见灯光指引才触礁！',
    ],
    suspects: [
      {
        id: 's1',
        name: '守塔人 · 老赵',
        role: '灯塔夜班值守员',
        avatar: '👴',
        statement: '那天夜里狂风暴雨，咚咚的撞门声太响了，我提着油灯下楼开门却没看见人影。',
        secretAlibi: '我开门时只在台阶上看到几根湿漉漉的白色羽毛。等我关门回屋歇息时，完全没注意到塔顶主探照灯的保险丝已经跳闸熄灭了！',
        interrogated: false,
      },
      {
        id: 's2',
        name: '轮船大副 · 杰克',
        role: '遇难货轮幸存者',
        avatar: '⚓',
        statement: '那片暗礁海域我们跑过几十次，只要有信号指引绝不可能撞上去！',
        secretAlibi: '暴风雨夜海面伸手不见五指，我们全船紧盯着岸边方向，但本该每隔5秒扫过海面的灯塔强光整晚都没亮，货轮直接盲开撞上了暗礁！',
        interrogated: false,
      },
      {
        id: 's3',
        name: '海岸警长 · 霍克',
        role: '海事事故调查官',
        avatar: '🚤',
        statement: '现场没有任何撬锁或外人登岛的脚印，但门外散落着不少奇怪的痕迹。',
        secretAlibi: '我们在灯塔木门和玻璃窗下发现了十几只撞晕的海鸥与海鸟，它们在暴风雨夜追逐光源撞上了灯塔。',
        interrogated: false,
      },
    ],
  },
  {
    title: '致命的合影',
    face: '一对刚结婚的恩爱夫妻去热带雨林度蜜月。旅游回来冲洗照片时，丈夫看到其中一张妻子的单人美照，顿时脸色惨白并立刻报了警。照片里究竟有什么？',
    bottom: '这是一张在热带雨林夜晚用闪光灯拍摄的妻子单人照。在拍完这张照片后不久妻子便神秘失踪遇害了。照片冲洗出来后，丈夫在妻子身后的黑暗草丛背景里，清晰看到了一双潜伏的凶犯（或食人猛兽）发亮的眼睛与持刀黑影。',
    keywords: ['背景', '闪光灯', '潜伏'],
    quickQuestions: [
      '丈夫回来冲洗照片时妻子还在身边吗？',
      '是丈夫自己害死了妻子吗？',
      '可怕的细节藏在照片的背景里吗？',
      '这张照片是在夜晚用闪光灯拍的吗？',
      '妻子在拍完这张照片后就出事了吗？',
    ],
    deepQuestions: [
      '照片背景的草丛里拍到了潜伏的凶手或猛兽吗？',
      '是因为闪光灯亮起才拍清了妻子身后的致命危险吗？',
    ],
    solvePrompts: [
      '① 妻子的现状如何，照片是什么时候拍的？（夜间用闪光灯拍摄后，妻子很快失踪遇害）',
      '② 丈夫在冲洗出的照片里看到了什么才报警？（妻子身后的草丛背景里潜伏着凶手/猛兽的眼睛或黑影）',
    ],
    clues: [
      '提示一（人物状态）：丈夫是独自一人回来洗照片的，因为妻子在拍完那张照片后不久就在雨林里失踪遇害了。',
      '提示二（拍摄环境）：照片是在伸手不见五指的夜晚拍摄的，拍照瞬间开启了强力闪光灯。',
      '提示三（核心画面）：闪光灯照亮了妻子“身后的草丛背景”，显影出一双正在潜伏逼近的凶徒/猛兽眼睛！',
    ],
    suspects: [
      {
        id: 's1',
        name: '新婚丈夫 · 小陈',
        role: '悲痛的报案人',
        avatar: '🤵',
        statement: '我们在雨林露营的最后一晚拍了那卷胶卷，之后我就再也没见过她...',
        secretAlibi: '那晚天太黑，我打开相机闪光灯给妻子拍了那张单人照，拍完我转身收拾背包，仅仅两分钟她就不见了！直到今天洗出照片，我才看清她身后的黑暗里有什么！',
        interrogated: false,
      },
      {
        id: 's2',
        name: '雨林向导 · 昂山',
        role: '当地丛林猎人',
        avatar: '🏕️',
        statement: '我早就提醒过游客，夜里的原始雨林绝不能随便往深处走。',
        secretAlibi: '夜间雨林草丛里潜伏着极具攻击性的掠食者与流窜歹徒，平时肉眼根本看不见，只有强闪光灯亮起的一瞬间才能照出它们反光的瞳孔！',
        interrogated: false,
      },
      {
        id: 's3',
        name: '暗房技师 · 老林',
        role: '照相馆冲印师',
        avatar: '📷',
        statement: '那张底片在显影液里浮现出来的时候，连我这个洗了二十年照片的人都起了一身冷汗。',
        secretAlibi: '照片正面那位女士笑得很甜，但在她身后不到一米的灌木丛背景阴影里，清清楚楚印着一双凶狠发亮的眼睛和举起的利刃黑影！',
        interrogated: false,
      },
    ],
  },
];

export class RoomManager {
  private rooms: Map<string, RoomState> = new Map();

  generateRoomId(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let id = '';
    do {
      id = '';
      for (let i = 0; i < 4; i++) {
        id += chars[Math.floor(Math.random() * chars.length)];
      }
    } while (this.rooms.has(id));
    return id;
  }

  createRoom(
    hostPlayer: { id: string; name: string; avatar: string },
    customRoomId?: string,
    playMode: 'LOCAL_PARTY' | 'ONLINE_PARTY' = 'ONLINE_PARTY'
  ): RoomState {
    const id = customRoomId ? customRoomId.trim().toUpperCase() : this.generateRoomId();
    const pId = hostPlayer.id || `p_${Date.now()}`;

    // If room already exists, just join/update host cleanly
    const existingRoom = this.rooms.get(id);
    if (existingRoom) {
      return this.joinPlayer(id, { ...hostPlayer, id: pId }) || existingRoom;
    }

    const room: RoomState = {
      id,
      hostPlayerId: pId,
      players: {
        [pId]: {
          id: pId,
          name: hostPlayer.name || '派对房主',
          avatar: hostPlayer.avatar || '👑',
          score: 100,
          isHost: true,
          connected: true,
          online: true,
        },
      },
      gameType: 'LOBBY',
      playMode,
      aiMood: 'normal',
      aiQuip: `房间【${id}】已创立！无论是线下大屏扫码，还是线上把链接发到群里，朋友们都能一键上车！`,
      reactions: [],
      playerItems: {
        [pId]: { bombSteal: 1, supremeBuzz: 1, doubleCombo: 1 },
      },
      createdAt: Date.now(),
    };
    this.rooms.set(id, room);
    return room;
  }

  getRoom(roomId: string): RoomState | undefined {
    if (!roomId) return undefined;
    return this.rooms.get(roomId.trim().toUpperCase());
  }

  setPlayMode(roomId: string, mode: 'LOCAL_PARTY' | 'ONLINE_PARTY'): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;
    room.playMode = mode;
    room.aiMood = 'normal';
    room.aiQuip =
      mode === 'ONLINE_PARTY'
        ? '已切换为【线上远程联机模式】：支持微信群链接直入、单屏全功能自适应与远程社交大冒险！'
        : '已切换为【线下大屏客厅模式】：适合投影或大屏公放，手机扫码当无线手柄！';
    return room;
  }

  joinPlayer(
    roomId: string,
    player: { id: string; name: string; avatar: string; isHost?: boolean }
  ): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const existing = room.players[player.id];
    const isHost = existing ? existing.isHost : room.hostPlayerId === player.id || !!player.isHost;

    room.players[player.id] = {
      id: player.id,
      name: player.name || existing?.name || `玩家${Object.keys(room.players).length + 1}`,
      avatar: player.avatar || existing?.avatar || '😎',
      score: existing?.score ?? 100,
      isHost,
      connected: true,
      online: true,
    };

    if (!room.playerItems[player.id]) {
      room.playerItems[player.id] = { bombSteal: 1, supremeBuzz: 1, doubleCombo: 1 };
    }

    // If a game is already active, make sure late-joining player gets words/drawer list
    if (room.gameType === 'UNDERCOVER' && room.undercover) {
      if (!room.undercover.playerWords[player.id]) {
        room.undercover.playerWords[player.id] = room.undercover.civilianWord;
      }
      if (
        !room.undercover.speakerOrder.includes(player.id) &&
        !room.undercover.eliminatedPlayerIds.includes(player.id)
      ) {
        room.undercover.speakerOrder.push(player.id);
      }
    } else if (room.gameType === 'DOODLE' && room.doodle) {
      if (!room.doodle.drawerOrder.includes(player.id)) {
        room.doodle.drawerOrder.push(player.id);
      }
    }

    room.aiMood = 'cheering';
    room.aiQuip = `欢迎【${room.players[player.id].name}】加入房间！目前已有 ${
      Object.keys(room.players).length
    } 位玩家就位！`;
    return room;
  }

  addBotPlayers(roomId: string, count: number = 3): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const botTemplates = [
      { name: '戏精小明Bot', avatar: '🤖' },
      { name: '毒舌阿强Bot', avatar: '😈' },
      { name: '脑洞小美Bot', avatar: '🦊' },
      { name: '手速小欧Bot', avatar: '🦄' },
    ];

    const existingBotCount = Object.values(room.players).filter((p) => p.isBot).length;
    for (let i = 0; i < count; i++) {
      const template = botTemplates[(existingBotCount + i) % botTemplates.length];
      const botId = `bot_${Date.now()}_${i}`;
      room.players[botId] = {
        id: botId,
        name: template.name,
        avatar: template.avatar,
        score: 100,
        isHost: false,
        isBot: true,
        connected: true,
        online: true,
      };
      room.playerItems[botId] = { bombSteal: 1, supremeBuzz: 1, doubleCombo: 1 };
    }
    room.aiMood = 'laugh';
    room.aiQuip = `已召唤 ${count} 位高智商AI陪玩入座！他们不仅会发言、画画，还会抢答、抬杠与竞价！`;
    return room;
  }

  removePlayer(roomId: string, playerId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;
    if (room.players[playerId]) {
      room.players[playerId].connected = false;
      room.players[playerId].online = false;
    }
    return room;
  }

  reconnectPlayer(roomId: string, player: { id: string; name?: string; avatar?: string }): RoomState | null {
    const code = (roomId || '').trim().toUpperCase();
    if (!code) return null;
    let room = this.getRoom(code);
    if (!room) {
      // Seamlessly recreate if server cold-started
      room = this.createRoom(
        { id: player.id, name: player.name || '重连房主', avatar: player.avatar || '👑' },
        code
      );
      return room;
    }
    if (room.players[player.id]) {
      room.players[player.id].connected = true;
      room.players[player.id].online = true;
      if (player.name) room.players[player.id].name = player.name;
      if (player.avatar) room.players[player.id].avatar = player.avatar;
    } else {
      this.joinPlayer(code, { id: player.id, name: player.name || '重连玩家', avatar: player.avatar || '😎' });
    }
    return room;
  }

  // ============================================================================
  // 全局即时投掷物与嘴炮语音
  // ============================================================================
  throwReaction(
    roomId: string,
    senderId: string,
    type: ReactionType,
    targetPlayerId?: string
  ): FloatingReaction | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const sender = room.players[senderId];
    const target = targetPlayerId ? room.players[targetPlayerId] : undefined;

    const reaction: FloatingReaction = {
      id: `rx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId,
      senderName: sender?.name || '神秘人',
      type,
      targetPlayerId,
      x: 15 + Math.floor(Math.random() * 70),
      y: 20 + Math.floor(Math.random() * 60),
      timestamp: Date.now(),
    };

    if (!room.reactions) room.reactions = [];
    room.reactions.push(reaction);
    if (room.reactions.length > 20) {
      room.reactions.shift();
    }

    if (type === 'tomato' || type === 'egg') {
      const targetName = target?.name || '全场';
      room.aiMood = 'laugh';
      room.aiQuip = `哎呦！【${sender?.name || '有人'}】朝【${targetName}】猛扔了一个${
        type === 'tomato' ? '爆浆番茄 🍅' : '臭鸡蛋 🥚'
      }！群众的呼声很真实！`;
    } else if (type === 'bomb') {
      room.aiMood = 'shocked';
      room.aiQuip = `滴答滴答！【${sender?.name || '有人'}】丢出了一颗定时炸弹 💣！全员注意隐蔽！`;
    }

    return reaction;
  }

  playQuickVoice(roomId: string, playerId: string, phrase: string, soundKey: string): QuickVoiceEvent | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const p = room.players[playerId];
    const event: QuickVoiceEvent = {
      id: `qv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      playerId,
      playerName: p?.name || '开黑队友',
      phrase,
      soundKey,
      timestamp: Date.now(),
    };

    room.lastVoiceEvent = event;
    room.aiMood = 'sarcastic';
    room.aiQuip = `【${event.playerName}】大声喊道：“${phrase}”！线上开黑火药味上来了！`;
    return event;
  }

  useItemCard(roomId: string, playerId: string, cardType: ItemCardType): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    if (!room.playerItems[playerId]) {
      room.playerItems[playerId] = { bombSteal: 1, supremeBuzz: 1, doubleCombo: 1 };
    }
    const items = room.playerItems[playerId];

    const p = room.players[playerId];
    const pName = p?.name || '玩家';

    if (cardType === 'BOMB_STEAL' && items.bombSteal > 0) {
      items.bombSteal--;
      if (room.buzzer) {
        room.buzzer.activeItemUsed = { cardType, playerId, playerName: pName };
      }
      room.aiMood = 'shocked';
      room.aiQuip = `💣【${pName}】使用了【炸弹偷分卡】！若本轮答对，直接从榜首顺走 50 分！`;
    } else if (cardType === 'SUPREME_BUZZ' && items.supremeBuzz > 0) {
      items.supremeBuzz--;
      if (room.buzzer && room.buzzer.phase === 'QUESTION') {
        room.buzzer.phase = 'BUZZED';
        room.buzzer.buzzedPlayerId = playerId;
        room.buzzer.buzzedPlayerTime = Date.now();
        room.buzzer.activeItemUsed = { cardType, playerId, playerName: pName };
      }
      room.aiMood = 'laugh';
      room.aiQuip = `👑【${pName}】甩出了【绝对霸权卡】！无视手速竞争，强行锁死抢答权！`;
    } else if (cardType === 'DOUBLE_COMBO' && items.doubleCombo > 0) {
      items.doubleCombo--;
      if (room.buzzer) {
        room.buzzer.activeItemUsed = { cardType, playerId, playerName: pName };
      }
      room.aiMood = 'sarcastic';
      room.aiQuip = `🔥【${pName}】开启了【连击双倍卡】！高风险高收益，答对得分翻倍，答错受罚翻倍！`;
    }

    return room;
  }

  // ============================================================================
  // 1. 谁是卧底 (UNDERCOVER) 完整状态机
  // ============================================================================
  startUndercover(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const connectedIds = Object.keys(room.players).filter((id) => room.players[id].connected);
    if (connectedIds.length < 3) {
      this.addBotPlayers(roomId, 3 - connectedIds.length);
    }
    const allPlayerIds = Object.keys(room.players).filter((id) => room.players[id].connected);

    // Put human players first in speaking order so humans don't wait for bots on turn 1
    const sortedPlayers = [...allPlayerIds].sort((a, b) => {
      const aBot = room.players[a]?.isBot ? 1 : 0;
      const bBot = room.players[b]?.isBot ? 1 : 0;
      return aBot - bBot;
    });

    const pair = UNDERCOVER_PAIRS[Math.floor(Math.random() * UNDERCOVER_PAIRS.length)];
    const undercoverCount = allPlayerIds.length >= 6 ? 2 : 1;
    const shuffled = [...allPlayerIds].sort(() => Math.random() - 0.5);
    const undercoverIds = shuffled.slice(0, undercoverCount);

    const playerWords: Record<string, string> = {};
    allPlayerIds.forEach((id) => {
      playerWords[id] = undercoverIds.includes(id) ? pair.undercover : pair.civilian;
    });

    room.gameType = 'UNDERCOVER';
    room.undercover = {
      civilianWord: pair.civilian,
      undercoverWord: pair.undercover,
      undercoverPlayerIds: undercoverIds,
      playerWords,
      round: 1,
      phase: 'WORDS_REVEAL',
      speakerOrder: sortedPlayers,
      currentSpeakerIndex: 0,
      statements: [],
      votes: {},
      eliminatedPlayerIds: [],
      aiCommentary: '秘密词已下发！长按按键查看自己的词汇，千万不要直接念出词汇！',
    };
    room.aiMood = 'sarcastic';
    room.aiQuip = '《谁是卧底》开局！秘密词已精准送达各位设备！暗流涌动，演技大比拼开始！';
    return room;
  }

  advanceUndercoverToSpeaking(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;

    const uc = room.undercover;
    uc.phase = 'SPEAKING';
    uc.currentSpeakerIndex = 0;

    const currentSpeakerId = uc.speakerOrder[0];
    const speaker = room.players[currentSpeakerId];

    room.aiMood = 'normal';
    room.aiQuip = `发言阶段开启！第 1 位发言的是【${speaker?.name}】！请用一句话隐晦描述你的词汇！`;

    if (speaker?.isBot) {
      this.simulateNextBotUndercoverStatements(room);
    }
    return room;
  }

  addUndercoverStatement(roomId: string, playerId: string, text: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;

    const uc = room.undercover;
    const actualSpeakerId = uc.speakerOrder[uc.currentSpeakerIndex] || playerId;
    const player = room.players[playerId] || room.players[actualSpeakerId];

    const actualText = (text || '').trim() || '（线下已口头发言，直接传麦下一位）';
    uc.statements.push({
      playerId: player?.id || playerId,
      playerName: player?.name || '未知玩家',
      playerAvatar: player?.avatar || '👤',
      round: uc.round,
      text: actualText,
      timestamp: Date.now(),
    });

    uc.currentSpeakerIndex++;


    if (uc.currentSpeakerIndex >= uc.speakerOrder.length) {
      uc.phase = 'VOTING';
      uc.votes = {};
      room.aiMood = 'shocked';
      room.aiQuip = '本轮全员发言完毕！逻辑漏洞百出，谁在胡说八道？请所有人开始投出卧底嫌疑人！';
      this.simulateBotUndercoverVotes(room);
    } else {
      const nextSpeakerId = uc.speakerOrder[uc.currentSpeakerIndex];
      const nextSpeaker = room.players[nextSpeakerId];
      room.aiMood = 'normal';
      room.aiQuip = `【${player?.name}】发言完毕。下一位请【${nextSpeaker?.name}】发言！`;

      if (nextSpeaker?.isBot) {
        this.simulateNextBotUndercoverStatements(room);
      }
    }
    return room;
  }

  skipUndercoverToVoting(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;

    const uc = room.undercover;
    // Have any remaining bots in speakerOrder add their statements first
    while (uc.currentSpeakerIndex < uc.speakerOrder.length) {
      const speakerId = uc.speakerOrder[uc.currentSpeakerIndex];
      const speaker = room.players[speakerId];
      if (speaker?.isBot) {
        const pair =
          UNDERCOVER_PAIRS.find(
            (p) => p.civilian === uc.civilianWord || p.undercover === uc.undercoverWord
          ) || UNDERCOVER_PAIRS[0];
        const hintPool = pair.botHints || ['这东西很常见', '大家都认识它'];
        const hint = hintPool[(uc.currentSpeakerIndex + uc.round) % hintPool.length];
        uc.statements.push({
          playerId: speakerId,
          playerName: speaker.name,
          playerAvatar: speaker.avatar,
          round: uc.round,
          text: `${hint}。`,
          timestamp: Date.now(),
        });
      }
      uc.currentSpeakerIndex++;
    }

    uc.phase = 'VOTING';
    uc.votes = {};
    room.aiMood = 'shocked';
    room.aiQuip = '已直接快进至全员处决投票阶段！请点击你最怀疑的嫌疑人头像投出关键一票！';
    this.simulateBotUndercoverVotes(room);
    return room;
  }

  forceResolveUndercoverVotes(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;
    this.resolveUndercoverVoting(room);
    return room;
  }

  initiateUndercoverDuel(roomId: string, initiatorId: string, targetId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;

    const uc = room.undercover;
    const initiator = room.players[initiatorId];
    const target = room.players[targetId];

    uc.phase = 'DUEL';
    uc.duel = {
      active: true,
      initiatorId,
      targetId,
      timer: 15,
      trustVotes: {},
    };

    room.aiMood = 'shocked';
    room.aiQuip = `🚨【${initiator?.name}】当堂质询【${target?.name}】！公堂对峙开始，全员可按【保他/踩他】实时测谎！`;
    return room;
  }

  voteUndercoverDuel(roomId: string, voterId: string, choice: 'TRUST' | 'SUSPECT'): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover || !room.undercover.duel) return null;

    room.undercover.duel.trustVotes[voterId] = choice;
    return room;
  }

  concludeUndercoverDuel(roomId: string, aiVerdict?: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;

    const uc = room.undercover;
    if (uc.duel) {
      uc.duel.active = false;
      uc.duel.aiVerdict = aiVerdict || '公堂对峙结束，嫌疑人眼神飘忽，破绽已被全场记录！';
    }
    uc.phase = 'VOTING';
    room.aiMood = 'laugh';
    room.aiQuip = aiVerdict || '质询结束！心电图波动剧烈，请大家依据刚才的对峙表现投出死刑票！';
    this.simulateBotUndercoverVotes(room);
    return room;
  }

  private simulateNextBotUndercoverStatements(room: RoomState) {
    if (!room.undercover) return;
    const uc = room.undercover;

    while (uc.currentSpeakerIndex < uc.speakerOrder.length) {
      const speakerId = uc.speakerOrder[uc.currentSpeakerIndex];
      const speaker = room.players[speakerId];
      if (!speaker || !speaker.isBot) break;

      const isUndercover = uc.undercoverPlayerIds.includes(speakerId);
      const pair =
        UNDERCOVER_PAIRS.find(
          (p) => p.civilian === uc.civilianWord || p.undercover === uc.undercoverWord
        ) || UNDERCOVER_PAIRS[0];

      const hintPool = pair.botHints || ['这东西很常见大家都在用', '日常生活中必不可少', '品质有好有坏'];
      const hint = hintPool[(uc.currentSpeakerIndex + uc.round) % hintPool.length];
      const suffixes = [
        '而且我平时经常接触它。',
        '我觉得在座各位肯定都懂。',
        '特征太明显了，不用多说吧！',
        '懂的都懂，我的描述绝对是好人！',
      ];
      const suffix = suffixes[uc.currentSpeakerIndex % suffixes.length];
      const botText = isUndercover ? `${hint}，${suffix}` : `${hint}，${suffix}`;

      uc.statements.push({
        playerId: speakerId,
        playerName: speaker.name,
        playerAvatar: speaker.avatar,
        round: uc.round,
        text: botText,
        timestamp: Date.now(),
      });

      uc.currentSpeakerIndex++;
    }

    if (uc.currentSpeakerIndex >= uc.speakerOrder.length) {
      uc.phase = 'VOTING';
      uc.votes = {};
      room.aiMood = 'shocked';
      room.aiQuip = '本轮全员发言完毕！到底谁在强行圆谎？请所有人开始投出卧底嫌疑人！';
      this.simulateBotUndercoverVotes(room);
    }
  }

  castUndercoverVote(roomId: string, voterId: string, targetPlayerId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;

    const uc = room.undercover;
    if (uc.eliminatedPlayerIds.includes(voterId)) return room;

    uc.votes[voterId] = targetPlayerId;

    // Count only connected living voters so offline players never block voting
    const livingConnectedVoters = uc.speakerOrder.filter(
      (id) => room.players[id]?.connected !== false
    );
    const totalVotes = Object.keys(uc.votes).length;

    if (totalVotes >= livingConnectedVoters.length) {
      this.resolveUndercoverVoting(room);
    }
    return room;
  }

  private simulateBotUndercoverVotes(room: RoomState) {
    if (!room.undercover) return;
    const uc = room.undercover;

    const livingBotIds = uc.speakerOrder.filter((id) => room.players[id]?.isBot);
    const livingTargets = uc.speakerOrder;

    livingBotIds.forEach((botId, idx) => {
      const candidates = livingTargets.filter((id) => id !== botId);
      if (candidates.length > 0) {
        const target = candidates[(idx + uc.round) % candidates.length];
        uc.votes[botId] = target;
      }
    });

    const livingConnectedVoters = uc.speakerOrder.filter(
      (id) => room.players[id]?.connected !== false
    );
    if (Object.keys(uc.votes).length >= livingConnectedVoters.length) {
      this.resolveUndercoverVoting(room);
    }
  }

  private resolveUndercoverVoting(room: RoomState) {
    if (!room.undercover) return;
    const uc = room.undercover;

    const voteCounts: Record<string, number> = {};
    Object.values(uc.votes).forEach((targetId) => {
      voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
    });

    let maxVotes = 0;
    let eliminatedId = '';
    let isTie = false;

    for (const [targetId, count] of Object.entries(voteCounts)) {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedId = targetId;
        isTie = false;
      } else if (count === maxVotes && maxVotes > 0) {
        isTie = true;
      }
    }

    if (isTie || !eliminatedId) {
      uc.lastEliminatedId = undefined;
      uc.phase = 'REVEAL_RESULT';
      room.aiMood = 'sarcastic';
      room.aiQuip = `本轮平票！没有人被处决！看来卧底的伪装太深，大家心慈手软了！`;
    } else {
      if (!uc.eliminatedPlayerIds.includes(eliminatedId)) {
        uc.eliminatedPlayerIds.push(eliminatedId);
      }
      uc.lastEliminatedId = eliminatedId;
      uc.speakerOrder = uc.speakerOrder.filter((id) => id !== eliminatedId);

      const eliminatedPlayer = room.players[eliminatedId];
      const isUndercover = uc.undercoverPlayerIds.includes(eliminatedId);

      uc.phase = 'REVEAL_RESULT';
      if (isUndercover) {
        room.aiMood = 'cheering';
        room.aiQuip = `大快人心！【${eliminatedPlayer?.name}】被处决，其真实身份就是【卧底】！词汇是【${uc.undercoverWord}】！`;
        Object.keys(room.players).forEach((id) => {
          if (!uc.undercoverPlayerIds.includes(id)) {
            room.players[id].score += 50;
          }
        });
      } else {
        room.aiMood = 'laugh';
        room.aiQuip = `冤枉啊！【${eliminatedPlayer?.name}】惨遭误杀，其实是无辜的平民！卧底在暗中狂笑！`;
      }
    }

    const livingUndercovers = uc.undercoverPlayerIds.filter((id) => !uc.eliminatedPlayerIds.includes(id));
    const livingCivilians = uc.speakerOrder.filter((id) => !uc.undercoverPlayerIds.includes(id));

    if (livingUndercovers.length === 0) {
      uc.winner = 'CIVILIANS';
      uc.phase = 'GAME_OVER';
      room.aiMood = 'cheering';
      room.aiQuip = `游戏结束！平民阵营大获全胜！卧底全军覆没！所有平民各加 +80 积分！`;

      // Loser penalty card for undercover
      const loserId = uc.undercoverPlayerIds[0];
      const loserPlayer = room.players[loserId] || Object.values(room.players)[0];
      const penalty = TRUTH_OR_DARE_PENALTIES[Math.floor(Math.random() * TRUTH_OR_DARE_PENALTIES.length)];
      uc.penaltyCard = {
        type: penalty.type,
        targetPlayerName: loserPlayer?.name || '落网卧底',
        targetPlayerAvatar: loserPlayer?.avatar || '🎭',
        title: penalty.title,
        content: penalty.content,
        badge: penalty.badge,
      };
    } else if (livingUndercovers.length >= livingCivilians.length) {
      uc.winner = 'UNDERCOVER';
      uc.phase = 'GAME_OVER';
      livingUndercovers.forEach((id) => {
        if (room.players[id]) room.players[id].score += 120;
      });
      room.aiMood = 'laugh';
      room.aiQuip = `游戏结束！卧底【${livingUndercovers
        .map((id) => room.players[id]?.name)
        .join('、')}】凭借绝顶演技存活到底，逆风翻盘！奖励 +120 积分！`;

      // Loser penalty card for civilians
      const loserCandidate = uc.lastEliminatedId || livingCivilians[0] || Object.keys(room.players)[0];
      const loserPlayer = room.players[loserCandidate] || Object.values(room.players)[0];
      const penalty = TRUTH_OR_DARE_PENALTIES[Math.floor(Math.random() * TRUTH_OR_DARE_PENALTIES.length)];
      uc.penaltyCard = {
        type: penalty.type,
        targetPlayerName: loserPlayer?.name || '战败平民代表',
        targetPlayerAvatar: loserPlayer?.avatar || '😭',
        title: penalty.title,
        content: penalty.content,
        badge: penalty.badge,
      };
    }
  }


  nextUndercoverRound(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.undercover) return null;

    const uc = room.undercover;
    if (uc.winner) return room;

    uc.round++;
    uc.phase = 'SPEAKING';
    uc.currentSpeakerIndex = 0;
    uc.votes = {};
    uc.lastEliminatedId = undefined;

    const firstSpeaker = room.players[uc.speakerOrder[0]];
    room.aiMood = 'normal';
    room.aiQuip = `进入第 ${uc.round} 轮发言！幸存者请继续阐述，由【${firstSpeaker?.name}】先开始！`;

    if (firstSpeaker?.isBot) {
      this.simulateNextBotUndercoverStatements(room);
    }
    return room;
  }

  // ============================================================================
  // 2. 灵魂画手 (DOODLE) & 同屏同步画板 & AI艺术拍卖行
  // ============================================================================
  startDoodle(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const playerIds = Object.keys(room.players).filter((id) => room.players[id].connected);
    if (playerIds.length === 0) return null;

    const sortedOrder = [...playerIds].sort((a, b) => {
      const aBot = room.players[a]?.isBot ? 1 : 0;
      const bBot = room.players[b]?.isBot ? 1 : 0;
      return aBot - bBot;
    });

    const promptObj = DOODLE_PROMPTS[Math.floor(Math.random() * DOODLE_PROMPTS.length)];
    const drawerId = sortedOrder[0];

    room.gameType = 'DOODLE';
    room.doodle = {
      drawerOrder: sortedOrder,
      currentDrawerIndex: 0,
      currentDrawerId: drawerId,
      coOpMode: false,
      prompt: promptObj.prompt,
      category: promptObj.category,
      hint: `${promptObj.prompt.length}个字 · ${promptObj.category}`,
      revealedHint: undefined,
      round: 1,
      maxRounds: Math.max(sortedOrder.length, 3),
      phase: 'DRAWING',
      timeLeft: 60,
      strokes: [],
      guessedPlayerIds: [],
      guesses: [],
    };

    if (room.players[drawerId]?.isBot) {
      this.generateBotDoodleStrokes(room);
    }

    room.aiMood = 'normal';
    room.aiQuip = `第 1 轮作画开始！当前灵魂画手是【${room.players[drawerId]?.name}】，提示：${room.doodle.hint}！支持切换【全员同屏合画】！`;
    return room;
  }

  nextDoodleTurn(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return this.startDoodle(roomId);

    const d = room.doodle;
    // Refresh drawerOrder to include all currently connected players
    const connectedIds = Object.keys(room.players).filter((id) => room.players[id].connected);
    if (connectedIds.length > 0) {
      d.drawerOrder = connectedIds.sort((a, b) => {
        const aBot = room.players[a]?.isBot ? 1 : 0;
        const bBot = room.players[b]?.isBot ? 1 : 0;
        return aBot - bBot;
      });
    }

    const nextIdx = (d.currentDrawerIndex + 1) % d.drawerOrder.length;
    const drawerId = d.drawerOrder[nextIdx];
    const promptObj = DOODLE_PROMPTS[(d.round + nextIdx) % DOODLE_PROMPTS.length];

    d.currentDrawerIndex = nextIdx;
    d.currentDrawerId = drawerId;
    d.prompt = promptObj.prompt;
    d.category = promptObj.category;
    d.hint = `${promptObj.prompt.length}个字 · ${promptObj.category}`;
    d.revealedHint = undefined;
    d.round++;
    d.phase = 'DRAWING';
    d.timeLeft = 60;
    d.strokes = [];
    d.guessedPlayerIds = [];
    d.guesses = [];
    d.aiReview = undefined;
    d.auction = undefined;

    if (room.players[drawerId]?.isBot) {
      this.generateBotDoodleStrokes(room);
    }

    room.aiMood = 'normal';
    room.aiQuip = `第 ${d.round} 轮！轮到【${room.players[drawerId]?.name}】提笔作画！其他人直接输入答案抢分！`;
    return room;
  }

  setDoodleDrawer(roomId: string, playerId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return null;
    const d = room.doodle;
    if (!room.players[playerId]) return room;

    d.currentDrawerId = playerId;
    const idx = d.drawerOrder.indexOf(playerId);
    if (idx >= 0) d.currentDrawerIndex = idx;

    room.aiMood = 'cheering';
    room.aiQuip = `🎨【${room.players[playerId].name}】抢过画笔担任本轮主笔！大家快看他的神仙画技！`;
    return room;
  }

  toggleDoodleCoOp(roomId: string, coOpMode?: boolean): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return null;
    const d = room.doodle;
    d.coOpMode = coOpMode !== undefined ? coOpMode : !d.coOpMode;
    room.aiMood = 'laugh';
    room.aiQuip = d.coOpMode
      ? '🤝 已开启【全员同屏合作画模式】！房间内所有玩家现在都可以在画板上同时作画，实时同步！'
      : `🎨 已切换回【单人主笔猜词模式】！当前由【${room.players[d.currentDrawerId]?.name}】独自作画，其余人猜词！`;
    return room;
  }

  revealDoodleHintChar(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return null;
    const d = room.doodle;
    const chars = d.prompt.split('');
    const masked = chars
      .map((ch, idx) => (idx === 0 || idx === chars.length - 1 ? ch : '•'))
      .join(' ');
    d.revealedHint = masked;
    d.hint = `${d.prompt.length}个字 · ${d.category} · 提示: ${masked}`;
    room.aiMood = 'normal';
    room.aiQuip = `💡 画手放出了关键首尾字提示：【${masked}】！这下总能猜出来了吧！`;
    return room;
  }

  private generateBotDoodleStrokes(room: RoomState) {
    if (!room.doodle) return;
    const strokes: DoodleStroke[] = [];
    const circlePoints = 24;
    for (let i = 0; i <= circlePoints; i++) {
      const angle = (i / circlePoints) * Math.PI * 2;
      const x = 0.5 + Math.cos(angle) * 0.18;
      const y = 0.45 + Math.sin(angle) * 0.18;
      strokes.push({
        x,
        y,
        type: i === 0 ? 'start' : i === circlePoints ? 'end' : 'draw',
        color: '#22D3EE',
        size: 5,
      });
    }
    // Ears
    strokes.push({ x: 0.36, y: 0.32, type: 'start', color: '#EC4899', size: 5 });
    strokes.push({ x: 0.32, y: 0.18, type: 'draw', color: '#EC4899', size: 5 });
    strokes.push({ x: 0.44, y: 0.27, type: 'draw', color: '#EC4899', size: 5 });
    strokes.push({ x: 0.44, y: 0.27, type: 'end', color: '#EC4899', size: 5 });

    strokes.push({ x: 0.64, y: 0.32, type: 'start', color: '#EC4899', size: 5 });
    strokes.push({ x: 0.68, y: 0.18, type: 'draw', color: '#EC4899', size: 5 });
    strokes.push({ x: 0.56, y: 0.27, type: 'draw', color: '#EC4899', size: 5 });
    strokes.push({ x: 0.56, y: 0.27, type: 'end', color: '#EC4899', size: 5 });

    // Eyes & Smile
    strokes.push({ x: 0.43, y: 0.42, type: 'start', color: '#FBBF24', size: 6 });
    strokes.push({ x: 0.44, y: 0.42, type: 'draw', color: '#FBBF24', size: 6 });
    strokes.push({ x: 0.44, y: 0.42, type: 'end', color: '#FBBF24', size: 6 });

    strokes.push({ x: 0.56, y: 0.42, type: 'start', color: '#FBBF24', size: 6 });
    strokes.push({ x: 0.57, y: 0.42, type: 'draw', color: '#FBBF24', size: 6 });
    strokes.push({ x: 0.57, y: 0.42, type: 'end', color: '#FBBF24', size: 6 });

    strokes.push({ x: 0.44, y: 0.51, type: 'start', color: '#4ADE80', size: 5 });
    strokes.push({ x: 0.5, y: 0.56, type: 'draw', color: '#4ADE80', size: 5 });
    strokes.push({ x: 0.56, y: 0.51, type: 'draw', color: '#4ADE80', size: 5 });
    strokes.push({ x: 0.56, y: 0.51, type: 'end', color: '#4ADE80', size: 5 });

    room.doodle.strokes = strokes;
  }

  addDoodleStroke(roomId: string, stroke: DoodleStroke): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return null;
    room.doodle.strokes.push(stroke);
    return room;
  }

  addDoodleStrokesBatch(roomId: string, strokes: DoodleStroke[]): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle || !Array.isArray(strokes)) return null;
    room.doodle.strokes.push(...strokes);
    return room;
  }

  clearDoodleCanvas(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return null;
    room.doodle.strokes = [];
    return room;
  }

  submitDoodleGuess(roomId: string, playerId: string, text: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return null;

    const d = room.doodle;
    const trimmed = (text || '').trim();
    if (!trimmed) return room;

    const player = room.players[playerId];
    const promptItem = DOODLE_PROMPTS.find((item) => item.prompt === d.prompt);
    const coreWords = promptItem?.coreWords || [];

    // Exact match or full prompt contained in guess
    const isExactCorrect =
      trimmed === d.prompt ||
      (trimmed.length >= Math.max(2, d.prompt.length - 1) && trimmed.includes(d.prompt));

    // Close match: contains one of the core words (e.g. "猫" or "外卖") or >= 2 matching non-particle characters
    const cleanGuess = trimmed.replace(/[的了在是和与]/g, '');
    const isClose =
      !isExactCorrect &&
      cleanGuess.length >= 1 &&
      (coreWords.some((cw) => trimmed.includes(cw)) ||
        (cleanGuess.length >= 2 && d.prompt.includes(cleanGuess)));

    d.guesses.unshift({
      playerId,
      playerName: player?.name || '神秘玩家',
      text: trimmed,
      correct: isExactCorrect,
      close: isClose,
      timestamp: Date.now(),
    });

    if (isExactCorrect) {
      if (!d.guessedPlayerIds.includes(playerId)) {
        d.guessedPlayerIds.push(playerId);
        if (player) player.score += 80;
        const drawer = room.players[d.currentDrawerId];
        if (drawer && drawer.id !== playerId) drawer.score += 40;
      }

      room.aiMood = 'cheering';
      room.aiQuip = `🎉 恭喜【${player?.name}】一字不差猜中了【${d.prompt}】(+80分)！`;

      // Check if all human non-drawers have guessed
      const humanGuessers = Object.values(room.players).filter(
        (p) => p.connected && !p.isBot && p.id !== d.currentDrawerId
      );
      if (humanGuessers.length > 0 && humanGuessers.every((p) => d.guessedPlayerIds.includes(p.id))) {
        this.startDoodleAuction(roomId, 660);
      }
    } else if (isClose) {
      room.aiMood = 'shocked';
      room.aiQuip = `🔥【${player?.name}】猜了“${trimmed}”——非常接近核心词了！再把修饰词和主体连起来猜！`;
    } else {
      room.aiMood = 'sarcastic';
      room.aiQuip = `【${player?.name}】猜了：“${trimmed}”，脑洞很大但还不完全对哦！提示：${d.hint}`;
    }
    return room;
  }

  startDoodleAuction(roomId: string, estimatedPrice: number = 500): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle) return null;

    const d = room.doodle;
    d.phase = 'AUCTION';
    d.auction = {
      active: true,
      estimatedPrice,
      currentBid: Math.floor(estimatedPrice * 0.3),
      bidsCount: 0,
      timer: 15,
      ended: false,
    };

    room.aiMood = 'laugh';
    room.aiQuip = `🏛️【AI艺术拍卖行】开槌！此画作被AI鉴定为国宝级抽象孤品，起拍价【${d.auction.currentBid}分】！全员疯狂加价抢购！`;
    return room;
  }

  bidDoodleAuction(roomId: string, bidderId: string, bidAmount: number): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle || !room.doodle.auction) return null;

    const auc = room.doodle.auction;
    if (auc.ended) return room;

    const bidder = room.players[bidderId];
    if (bidAmount <= auc.currentBid) return room;

    auc.currentBid = bidAmount;
    auc.highestBidderId = bidderId;
    auc.highestBidderName = bidder?.name || '神秘藏家';
    auc.bidsCount++;

    room.aiMood = 'shocked';
    room.aiQuip = `🔨【${auc.highestBidderName}】高呼出价【${bidAmount}分】！谁还敢往上顶？！`;
    return room;
  }

  finishDoodleAuction(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.doodle || !room.doodle.auction) return null;

    const auc = room.doodle.auction;
    auc.ended = true;
    auc.active = false;
    room.doodle.phase = 'REVEAL';

    if (auc.highestBidderId) {
      const buyer = room.players[auc.highestBidderId];
      const drawer = room.players[room.doodle.currentDrawerId];
      if (buyer) buyer.score += 50;
      if (drawer) drawer.score += 50;
      room.aiMood = 'cheering';
      room.aiQuip = `🎊 成交！大藏家【${buyer?.name}】以【${auc.currentBid}分】拍下神作！双方各获 +50 荣耀积分！`;
    } else {
      room.aiMood = 'sarcastic';
      room.aiQuip = `流拍了！AI鉴定师痛心疾首：这届玩家不懂真正的高级抽象艺术！`;
    }
    return room;
  }

  // ============================================================================
  // 3. 手速抢答 (BUZZER) & 道具卡 & 同步命运转盘
  // ============================================================================
  startBuzzer(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const qItem = BUZZER_QUESTIONS[0];

    room.gameType = 'BUZZER';
    room.buzzer = {
      question: qItem.question,
      options: qItem.options,
      correctIndex: qItem.correctIndex,
      answer: qItem.options[qItem.correctIndex],
      explanation: qItem.explanation,
      buzzedPlayerId: null,
      phase: 'QUESTION',
      round: 1,
      maxRounds: 5,
    };
    room.aiMood = 'shocked';
    room.aiQuip = `手速抢答第 1 题！请听题：【${qItem.question}】！先拍先答，抢答前可甩道具卡！`;
    return room;
  }

  nextBuzzerQuestion(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.buzzer) return this.startBuzzer(roomId);

    const b = room.buzzer;
    const nextRound = b.round >= b.maxRounds ? 1 : b.round + 1;
    const qItem = BUZZER_QUESTIONS[(nextRound - 1) % BUZZER_QUESTIONS.length];

    b.round = nextRound;
    b.question = qItem.question;
    b.options = qItem.options;
    b.correctIndex = qItem.correctIndex;
    b.answer = qItem.options[qItem.correctIndex];
    b.explanation = qItem.explanation;
    b.buzzedPlayerId = null;
    b.buzzedPlayerTime = undefined;
    b.selectedOptionIndex = undefined;
    b.isAnswerCorrect = undefined;
    b.penaltyTargetPlayerId = undefined;
    b.wheelResult = undefined;
    b.wheelTargetIndex = undefined;
    b.wheelSpinId = undefined;
    b.aiRoast = undefined;
    b.activeItemUsed = undefined;
    b.phase = 'QUESTION';

    room.aiMood = 'shocked';
    room.aiQuip = `第 ${b.round} 题！【${qItem.question}】准备好手速与脑力！`;
    return room;
  }

  buzzIn(roomId: string, playerId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.buzzer) return null;

    if (room.buzzer.phase !== 'QUESTION' || room.buzzer.buzzedPlayerId !== null) {
      return room;
    }

    room.buzzer.buzzedPlayerId = playerId;
    room.buzzer.buzzedPlayerTime = Date.now();
    room.buzzer.phase = 'BUZZED';

    const player = room.players[playerId];
    room.aiMood = 'shocked';
    room.aiQuip = `💥 抢到了！【${player?.name || '神秘手速王'}】成功锁死抢答权！请在12秒内点击选项提交！`;
    return room;
  }

  submitBuzzerAnswer(roomId: string, optionIndex: number): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.buzzer) return null;

    room.buzzer.selectedOptionIndex = optionIndex;
    const isCorrect = optionIndex === room.buzzer.correctIndex;
    const p = room.buzzer.buzzedPlayerId ? room.players[room.buzzer.buzzedPlayerId] : undefined;
    const pName = p?.name || '抢答选手';
    room.buzzer.isAnswerCorrect = isCorrect;

    const item = room.buzzer.activeItemUsed;

    if (isCorrect) {
      let addScore = 60;
      let stealNotice = '';
      if (item?.cardType === 'DOUBLE_COMBO') {
        addScore = 120;
        stealNotice = '（连击双倍卡生效：+120分！）';
      } else if (item?.cardType === 'BOMB_STEAL') {
        const otherPlayers = Object.values(room.players).filter((pl) => pl.id !== p?.id);
        const topPlayer = otherPlayers.sort((a, b) => b.score - a.score)[0];
        if (topPlayer && topPlayer.score > 50) {
          topPlayer.score -= 50;
          addScore = 110;
          stealNotice = `（炸弹偷分成功！从【${topPlayer.name}】身上顺走 50 分！）`;
        }
      }

      if (p) p.score += addScore;
      room.buzzer.phase = 'ANSWER_REVEAL';
      room.aiMood = 'cheering';
      room.aiQuip = `回答正确！【${pName}】手脑并用拿下 +${addScore} 分！${stealNotice} 解析：${room.buzzer.explanation}`;
    } else {
      room.buzzer.phase = 'WHEEL_SPIN';
      room.buzzer.penaltyTargetPlayerId = room.buzzer.buzzedPlayerId || undefined;
      const targetIndex = Math.floor(Math.random() * PENALTY_WHEEL_ITEMS.length);
      const penaltyItem = PENALTY_WHEEL_ITEMS[targetIndex];
      room.buzzer.wheelTargetIndex = targetIndex;
      room.buzzer.wheelResult = penaltyItem;
      room.buzzer.wheelSpinId = Date.now();
      room.aiMood = 'laugh';
      room.aiQuip = `答错啦！正确答案是【${room.buzzer.answer}】！命运大转盘已自动启动，看看【${pName}】会抽中什么社死大冒险！`;
    }
    return room;
  }

  spinBuzzerWheel(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.buzzer) return null;

    const targetIndex = Math.floor(Math.random() * PENALTY_WHEEL_ITEMS.length);
    const penaltyItem = PENALTY_WHEEL_ITEMS[targetIndex];
    room.buzzer.wheelTargetIndex = targetIndex;
    room.buzzer.wheelResult = penaltyItem;
    room.buzzer.wheelSpinId = Date.now();

    const p = room.buzzer.penaltyTargetPlayerId
      ? room.players[room.buzzer.penaltyTargetPlayerId]
      : undefined;
    room.aiMood = 'laugh';
    room.aiQuip = `🎰 命运大转盘重新旋转定格！受罚人【${p?.name || '抢答选手'}】抽中：【${penaltyItem}】！`;
    return room;
  }

  // Backward-compatible aliases
  submitUndercoverStatement(roomId: string, playerId: string, text: string): RoomState | null {
    return this.addUndercoverStatement(roomId, playerId, text);
  }

  voteUndercover(roomId: string, voterId: string, targetPlayerId: string): RoomState | null {
    return this.castUndercoverVote(roomId, voterId, targetPlayerId);
  }

  triggerBuzz(roomId: string, playerId: string): { success: boolean; playerId?: string } | null {
    const room = this.buzzIn(roomId, playerId);
    if (!room || !room.buzzer) return null;
    return { success: room.buzzer.buzzedPlayerId === playerId, playerId: room.buzzer.buzzedPlayerId || undefined };
  }

  // ============================================================================
  // 4. AI海龟汤 (TURTLE SOUP) & 嫌疑人审讯 & 离线精准判案引擎
  // ============================================================================
  startTurtleSoup(roomId: string, customPresetIndex?: number): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    let presetIndex = customPresetIndex;
    if (presetIndex === undefined) {
      const currentTitle = room.turtleSoup?.soupTitle;
      const currentIdx = TURTLE_SOUP_PRESETS.findIndex((p) => p.title === currentTitle);
      presetIndex = currentIdx >= 0 ? (currentIdx + 1) % TURTLE_SOUP_PRESETS.length : 0;
    }

    const preset = TURTLE_SOUP_PRESETS[presetIndex % TURTLE_SOUP_PRESETS.length];

    room.gameType = 'TURTLE_SOUP';
    room.turtleSoup = {
      soupTitle: preset.title,
      soupFace: preset.face,
      soupBottom: preset.bottom,
      keywords: preset.keywords,
      quickQuestions: preset.quickQuestions,
      deepQuestions: preset.deepQuestions,
      solvePrompts: preset.solvePrompts,
      clues: preset.clues,
      unlockedClueCount: 0,
      questions: [],
      suspects: JSON.parse(JSON.stringify(preset.suspects || [])),
      solveAttempts: [],
      phase: 'QUESTIONING',
      aiComment:
        '案发现场已封锁！请先通过提问（是/否/无关/关键线索）或提审嫌疑人收集线索，集齐真相要素后再发起破案！',
    };
    room.aiMood = 'normal';
    room.aiQuip = `悬疑海龟汤《${preset.title}》开局！注意：直接猜单个词无法破案，必须先提问或提审嫌疑人查明来龙去脉！`;
    return room;
  }

  evaluateTurtleSoupQuestionOffline(
    roomId: string,
    question: string
  ): { answer: '是' | '否' | '无关' | '关键线索'; aiNote: string } {
    const room = this.getRoom(roomId);
    const soup = room?.turtleSoup;
    const q = (question || '').trim();
    if (!soup || !q) return { answer: '无关', aiNote: '请围绕案情核心细节提出具体问题！' };

    if (soup.soupTitle === '半根火柴') {
      // 1. Check specific false theories first so they never false-trigger positive matches
      if (/飞机|直升机|降落伞|跳伞|滑翔伞|火箭|宇宙飞船/.test(q)) {
        return { answer: '否', aiNote: '不是飞机也不是跳伞，但确实是一种在空中飘浮的轻型载具，再猜猜？' };
      }
      if (/走|步行|爬|开车|骑|车/.test(q)) {
        return { answer: '否', aiNote: '周围没有任何脚印或车辙，他根本不是从地面进入荒漠的！' };
      }
      if (/谋杀|他杀|害死|推下|打死|杀害|仇|绑架/.test(q)) {
        return { answer: '否', aiNote: '没有阴谋或他杀，同伴们也都不想他死，是绝境下的无奈之举！' };
      }
      if (/点火|点烟|照明|取暖|生火|烧|抽烟/.test(q)) {
        return { answer: '否', aiNote: '火柴并没有被划燃过，它的作用不是点火，而是用来做某个决定的工具！' };
      }
      if (/渴死|饿死|中暑|热死|晒死|毒|病/.test(q)) {
        return { answer: '否', aiNote: '他不是渴死或晒死的，死因是瞬间发生的剧烈撞击！' };
      }
      if (/别人扒|抢走|偷走|强迫脱/.test(q)) {
        return { answer: '否', aiNote: '衣服不是被人抢走的，是他自己主动脱下扔掉的！' };
      }
      if (/只有他|独自|一个人/.test(q)) {
        return { answer: '否', aiNote: '不是独自一人，案发前有几名同伴和他在一起！' };
      }

      // 2. Check key breakthrough clues
      if (/热气球|飞艇|吊篮|浮空/.test(q)) {
        return { answer: '关键线索', aiNote: '一针见血！他们乘坐的正是高空热气球，途中发生了故障下坠！' };
      }
      if (/减重|减轻重量|超重|太重|负重/.test(q)) {
        return { answer: '关键线索', aiNote: '太敏锐了！脱掉衣服和扔掉行李正是为了给下坠的载具减轻重量！' };
      }
      if (/抽签|抓阄|抽火柴|长短|决定谁/.test(q)) {
        return { answer: '关键线索', aiNote: '完全正确！半根折断的短火柴正是生死抽签的工具！' };
      }
      if (/高空|天上|空中|掉下|坠落|摔死|跳下/.test(q)) {
        return { answer: '关键线索', aiNote: '重大突破！死者确实是从高空坠落摔死在荒漠里的！' };
      }

      // 3. Check general affirmative questions
      if (/交通工具|载具|故障|事故|失事/.test(q)) {
        return { answer: '是', aiNote: '方向完全正确！他们乘坐的某种交通工具在空中出了故障！' };
      }
      if (/同伴|其他人|别人|朋友|一起/.test(q)) {
        return { answer: '是', aiNote: '是的！当时还有其他同伴和他在同一个载具上！' };
      }
      if (/自愿|自己脱|主动|牺牲|自杀/.test(q)) {
        return { answer: '是', aiNote: '是的，无论是脱衣服还是最后跳下去，都是他为了大局主动做的！' };
      }
      if (/衣服|裸体|脱/.test(q)) {
        return { answer: '是', aiNote: '脱衣服是非常关键的自救行为，想想在空中下坠为什么要扔衣服？' };
      }
      if (/火柴/.test(q)) {
        return { answer: '是', aiNote: '这半根折断的火柴决定了他的命运，几个人面临绝境时用长短火柴能干什么？' };
      }
    } else if (soup.soupTitle === '酒吧里的枪声') {
      if (/认识|仇|欠钱|抢劫|杀|威胁|情敌|警察/.test(q)) {
        return { answer: '否', aiNote: '两人素不相识，也没有任何仇恨或犯罪企图！' };
      }
      if (/开枪|射|打中|受伤|死/.test(q)) {
        return { answer: '否', aiNote: '酒保并没有真的开枪，只是突然掏出枪对准他做个架势！' };
      }
      if (/喝了|还需要水|口渴/.test(q)) {
        return { answer: '否', aiNote: '他要水并不是因为口渴，而且被枪指了之后他已经不需要喝水了！' };
      }
      if (/打嗝|止嗝|嗝/.test(q)) {
        return { answer: '关键线索', aiNote: '神探！男人当时正在剧烈打嗝，去酒吧要水正是为了止嗝！' };
      }
      if (/吓|惊吓|治好|治病/.test(q)) {
        return { answer: '关键线索', aiNote: '一语中的！酒保掏枪正是为了吓他一跳，帮他治好身体的小毛病！' };
      }
      if (/好意|帮他|感谢|帮忙/.test(q)) {
        return { answer: '是', aiNote: '完全正确！酒保掏枪完全是出于好意帮他解决问题！' };
      }
      if (/不舒服|异常|毛病|病|生理/.test(q)) {
        return { answer: '是', aiNote: '是的！男人进酒吧时身上有一种很常见但很难受的生理小状况！' };
      }
    } else if (soup.soupTitle === '深夜敲门声') {
      if (/人敲|是人|小偷|海盗|坏人|故意|谋杀|鬼|幽灵|船员敲/.test(q)) {
        return { answer: '否', aiNote: '敲门的不是人类也不是鬼魂，更没有人蓄意谋杀！' };
      }
      if (/睡着|偷懒|喝酒/.test(q)) {
        return { answer: '否', aiNote: '守塔人并没有偷懒睡觉，他是被半夜的撞门声吸引了注意力！' };
      }
      if (/海鸟|鸟|海鸥|飞鸟|动物/.test(q)) {
        return { answer: '关键线索', aiNote: '精准命中！半夜撞击灯塔门窗的正是暴风雨中迷航的海鸟！' };
      }
      if (/熄灭|灭了|没亮|故障|跳闸|导航灯|看不见灯/.test(q)) {
        return { answer: '关键线索', aiNote: '核心突破！灯塔顶部的导航主灯熄灭了，导致远洋轮船失去指引触礁！' };
      }
      if (/灯|光|指引|信号|有关/.test(q)) {
        return { answer: '是', aiNote: '没错！轮船在黑夜暴风雨中航行全靠灯塔顶部的灯光指引！' };
      }
    } else if (soup.soupTitle === '致命的合影') {
      if (/丈夫杀|丈夫害|丈夫是凶手|出轨|外遇|整容|鬼魂|灵异/.test(q)) {
        return { answer: '否', aiNote: '丈夫非常爱妻子，绝非丈夫行凶，也不是灵异鬼片！' };
      }
      if (/活着|还在身边|一起回来/.test(q)) {
        return { answer: '否', aiNote: '妻子并没有平安回来，她在拍完那张照片后不久就失踪遇害了！' };
      }
      if (/背景|身后|后面|草丛|阴影|暗处/.test(q)) {
        return { answer: '关键线索', aiNote: '眼力毒辣！令人毛骨悚然的真相就藏在妻子身后的草丛背景里！' };
      }
      if (/闪光灯|夜晚|晚上|野兽|花豹|凶手|杀人犯|眼睛|潜伏|黑影/.test(q)) {
        return { answer: '关键线索', aiNote: '切中要害！夜间闪光灯照亮了暗处，拍下了潜伏在妻子身后的致命凶徒/猛兽眼睛！' };
      }
      if (/出事|遇害|失踪|死|危险/.test(q)) {
        return { answer: '是', aiNote: '是的！按下快门的那一刻，致命危险已经近在咫尺，几分钟后妻子就遇害了！' };
      }
    }

    return {
      answer: '无关',
      aiNote: '这个细节与案件核心因果关联不大，不妨先提审上方 3 位嫌疑人或点击一键追问！',
    };
  }

  evaluateTurtleSoupSolveOffline(
    roomId: string,
    solveText: string
  ): {
    isSolved: boolean;
    aiComment: string;
    matchedPillars: string[];
    missingPillars: string[];
  } {
    const room = this.getRoom(roomId);
    const soup = room?.turtleSoup;
    const text = (solveText || '').trim();
    if (!soup || text.length < 6) {
      return {
        isSolved: false,
        aiComment: '❌ 破案失败：你的推理太简短啦！不能只填单个词，请把案件的来龙去脉完整写出来！',
        matchedPillars: [],
        missingPillars: ['完整案情因果链'],
      };
    }

    if (soup.soupTitle === '半根火柴') {
      if (/不是热气球|被.*谋杀|被.*推下|被.*杀害|他杀/.test(text)) {
        return {
          isSolved: false,
          aiComment: '❌ 破案失败：推理方向有误！死者并非被人谋杀推下，而是抽签后主动跳下牺牲的！',
          matchedPillars: [],
          missingPillars: ['高空载具失事', '脱衣减重自救', '抽火柴决定谁跳下牺牲'],
        };
      }

      const pillars = [
        {
          name: '高空载具故障下坠（热气球/飞艇）',
          reg: /热气球|飞艇|气球|吊篮|浮空|飞行器|(高空|空中).*(故障|下坠|掉|失事)/,
        },
        {
          name: '脱掉衣物减轻重量',
          reg: /减重|减轻.*重|超重|太重|负重|(脱|扔).*(衣|行李)/,
        },
        {
          name: '抽火柴决定谁跳下牺牲',
          reg: /抽签|抓阄|抽火柴|短火柴|抽中|抽到|(火柴).*(决定|跳|牺牲)/,
        },
      ];

      const matchedPillars = pillars.filter((p) => p.reg.test(text)).map((p) => p.name);
      const missingPillars = pillars.filter((p) => !p.reg.test(text)).map((p) => p.name);

      // Require at least 2 pillars AND must explain either the vehicle/altitude or the matchstick lottery
      const isSolved = matchedPillars.length >= 2;
      if (isSolved) {
        return {
          isSolved: true,
          aiComment: `✅ 破案成功！神探降世！你精准还原了核心真相：【${matchedPillars.join(' + ')}】！`,
          matchedPillars,
          missingPillars,
        };
      }

      return {
        isSolved: false,
        aiComment:
          matchedPillars.length === 1
            ? `⚠️ 破案未成功（只猜对了一部分）：你已点出【${matchedPillars[0]}】，但还缺少关键环节：【${missingPillars.join('、')}】！补充完整即可破案！`
            : `❌ 破案失败：尚未命中核心真相！请围绕【为何在荒漠无脚印】、【为何赤身裸体】、【半根火柴的作用】三点阐述！`,
        matchedPillars,
        missingPillars,
      };
    }

    if (soup.soupTitle === '酒吧里的枪声') {
      if (/抢劫|杀他|仇人|寻仇|真开枪/.test(text)) {
        return {
          isSolved: false,
          aiComment: '❌ 破案失败：酒保并非抢劫或寻仇，掏枪其实是出于好意帮男人解决身体小毛病！',
          matchedPillars: [],
          missingPillars: ['男人正在打嗝想喝水止嗝', '酒保掏枪惊吓帮他治好打嗝'],
        };
      }

      const pillars = [
        { name: '男人正在打嗝（要水止嗝）', reg: /打嗝|止嗝|嗝/ },
        { name: '酒保掏枪吓他一跳治好了打嗝', reg: /吓|惊吓|受惊|治好|治病|好意|帮他/ },
      ];
      const matchedPillars = pillars.filter((p) => p.reg.test(text)).map((p) => p.name);
      const missingPillars = pillars.filter((p) => !p.reg.test(text)).map((p) => p.name);

      const isSolved = matchedPillars.length === 2;
      if (isSolved) {
        return {
          isSolved: true,
          aiComment: `✅ 破案成功！逻辑满分！男人正是因为【打嗝】去要水，被酒保掏枪【吓了一跳当场治好】！`,
          matchedPillars,
          missingPillars,
        };
      }

      return {
        isSolved: false,
        aiComment:
          matchedPillars.length === 1
            ? `⚠️ 破案差一步：你已猜到【${matchedPillars[0]}】，但还需写明【${missingPillars[0]}】！`
            : `❌ 破案失败：请同时说明【男人进酒吧要水是因为什么生理小毛病】以及【酒保掏枪起到了什么作用】！`,
        matchedPillars,
        missingPillars,
      };
    }

    if (soup.soupTitle === '深夜敲门声') {
      if (/海盗|故意关灯|谋杀|鬼魂|水鬼/.test(text)) {
        return {
          isSolved: false,
          aiComment: '❌ 破案失败：本案没有坏人蓄意破坏或灵异事件，是暴风雨夜的意外连锁反应！',
          matchedPillars: [],
          missingPillars: ['暴风雨中迷航的海鸟撞门', '灯塔主灯熄灭导致轮船失去指引触礁'],
        };
      }

      const pillars = [
        { name: '迷航的海鸟/飞鸟半夜撞门', reg: /海鸟|鸟|海鸥|飞鸟|动物/ },
        { name: '灯塔主灯熄灭导致轮船看不见导航触礁', reg: /灭|没亮|故障|跳闸|失去导航|看不见.*灯|没有灯光/ },
      ];
      const matchedPillars = pillars.filter((p) => p.reg.test(text)).map((p) => p.name);
      const missingPillars = pillars.filter((p) => !p.reg.test(text)).map((p) => p.name);

      const isSolved = matchedPillars.length === 2;
      if (isSolved) {
        return {
          isSolved: true,
          aiComment: `✅ 破案成功！真相水落石出：【迷航的海鸟撞门】+【灯塔导航灯熄灭导致轮船盲开触礁】！`,
          matchedPillars,
          missingPillars,
        };
      }

      return {
        isSolved: false,
        aiComment:
          matchedPillars.length === 1
            ? `⚠️ 破案差一步：你已猜出【${matchedPillars[0]}】，但还需解释【${missingPillars[0]}】！`
            : `❌ 破案失败：请同时说明【半夜撞门声是什么动物】以及【轮船为什么会在海面触礁】！`,
        matchedPillars,
        missingPillars,
      };
    }

    // Case 4: 致命的合影
    if (/丈夫杀|丈夫害|丈夫是凶手|出轨/.test(text)) {
      return {
        isSolved: false,
        aiComment: '❌ 破案失败：丈夫深爱妻子，绝非丈夫行凶！秘密藏在照片的背景里！',
        matchedPillars: [],
        missingPillars: ['照片背景/妻子身后草丛暗藏危险', '闪光灯拍下潜伏的凶手/猛兽导致妻子随后遇害'],
      };
    }

    const pillars = [
      { name: '夜间闪光灯照亮了妻子身后的草丛背景', reg: /背景|身后|后面|草丛|阴影|暗处|闪光灯/ },
      { name: '潜伏着凶手/野兽的眼睛且妻子随后遇害失踪', reg: /野兽|花豹|猛兽|凶手|杀人犯|歹徒|眼睛|潜伏|黑影|遇害|失踪/ },
    ];
    const matchedPillars = pillars.filter((p) => p.reg.test(text)).map((p) => p.name);
    const missingPillars = pillars.filter((p) => !p.reg.test(text)).map((p) => p.name);

    const isSolved = matchedPillars.length === 2;
    if (isSolved) {
      return {
        isSolved: true,
        aiComment: `✅ 破案成功！细思极恐的真相：【闪光灯拍出了妻子身后草丛里潜伏的凶徒/猛兽双眼】！`,
        matchedPillars,
        missingPillars,
      };
    }

    return {
      isSolved: false,
      aiComment:
        matchedPillars.length === 1
          ? `⚠️ 破案差一步：你已点出【${matchedPillars[0]}】，但还需说明【${missingPillars[0]}】！`
          : `❌ 破案失败：请说明【照片的哪个位置不对劲】以及【里面拍到了什么导致妻子遇害】！`,
      matchedPillars,
      missingPillars,
    };
  }

  interrogateSuspect(roomId: string, suspectId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.turtleSoup) return null;

    const suspect = room.turtleSoup.suspects.find((s) => s.id === suspectId);
    if (!suspect) return room;

    suspect.interrogated = true;
    room.aiMood = 'shocked';
    room.aiQuip = `🎙️ 已提审【${suspect.name}】获取关键证词：“${suspect.secretAlibi}”！`;
    return room;
  }

  unlockTurtleSoupClue(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.turtleSoup) return null;
    const ts = room.turtleSoup;
    if (ts.unlockedClueCount < ts.clues.length) {
      ts.unlockedClueCount++;
      room.aiMood = 'normal';
      room.aiQuip = `💡 AI法官发放了第 ${ts.unlockedClueCount} 条破案提示：${ts.clues[ts.unlockedClueCount - 1]}`;
    }
    return room;
  }

  addTurtleSoupQuestion(
    roomId: string,
    playerId: string,
    question: string,
    answer: '是' | '否' | '无关' | '关键线索',
    aiNote?: string
  ): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.turtleSoup) return null;

    const p = room.players[playerId];
    const pName = p?.name || '大侦探';
    const pAvatar = p?.avatar || '🕵️';

    const qObj = {
      id: `ts_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      playerId,
      playerName: pName,
      playerAvatar: pAvatar,
      question,
      answer,
      aiNote,
      timestamp: Date.now(),
    };
    room.turtleSoup.questions.unshift(qObj);

    if (answer === '关键线索') {
      if (p) p.score += 30;
      room.aiMood = 'shocked';
      room.aiQuip = `🔥 关键突破！【${pName}】问出了核心线索：“${question}” (+30分)！👉 ${aiNote || ''}`;
    } else {
      room.aiMood = answer === '是' ? 'normal' : 'sarcastic';
      room.aiQuip = `【${pName}】问：“${question}” 👉 AI法官裁定：【${answer}】${aiNote ? ` — ${aiNote}` : ''}`;
    }
    return room;
  }

  attemptSolveTurtleSoup(
    roomId: string,
    playerId: string,
    text: string,
    isSolved: boolean,
    aiComment?: string,
    matchedPillars?: string[],
    missingPillars?: string[]
  ): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.turtleSoup) return null;

    const p = room.players[playerId];
    const pName = p?.name || '大侦探';
    // Calculate deduction based on clues unlocked, questions asked, and suspects interrogated
    const ts = room.turtleSoup;
    const questionsCount = ts.questions?.length || 0;
    const cluesCount = ts.unlockedClueCount || 0;
    const interrogatedCount = (ts.suspects || []).filter((s) => s.interrogated).length;
    
    // Max full score is 200 points.
    // Each question asks deducts 5 points; each clue unlocked deducts 20 points; each suspect interrogated deducts 15 points.
    // Minimum passing score is 60 points.
    const penaltyPoints = questionsCount * 5 + cluesCount * 20 + interrogatedCount * 15;
    const finalAwardScore = Math.max(60, 200 - penaltyPoints);
    const isPerfectSolve = questionsCount === 0 && cluesCount === 0 && interrogatedCount === 0;

    const successComment = isPerfectSolve
      ? `🏆 惊天神推理！【${pName}】未向法官提问、未看任何线索、未提审证人直接一眼看穿真相！荣获满分暴击 +${finalAwardScore} 分！`
      : `✅ 破案成功！【${pName}】还原案件核心真相！依据线索消耗（提问${questionsCount}次、线索${cluesCount}条、提审${interrogatedCount}人）核算奖励 +${finalAwardScore} 分！`;

    const comment = aiComment || (isSolved ? successComment : `❌ 破案未成功：【${pName}】的推理还缺少关键真相要素，请查看下方AI判案反馈继续补充！`);

    room.turtleSoup.solveAttempts.unshift({
      playerId,
      playerName: pName,
      text,
      success: isSolved,
      aiComment: comment,
      matchedPillars,
      missingPillars,
    });

    if (isSolved) {
      if (p) p.score += finalAwardScore;
      room.turtleSoup.phase = 'SOLVED';
      room.turtleSoup.solvedByPlayerName = pName;
      room.turtleSoup.scoreAwarded = finalAwardScore;
      room.turtleSoup.maxScore = 200;
      room.turtleSoup.aiComment = comment;
      room.aiMood = 'cheering';
      room.aiQuip = comment;
    } else {
      room.aiMood = 'sarcastic';
      room.aiQuip = comment;
    }
    return room;
  }


  // ============================================================================
  // 5. 派对终局高潮：AI毒舌颁奖盛典 & 显眼包MVP
  // ============================================================================
  triggerPartyCeremony(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room) return null;

    const playersList = Object.values(room.players).filter((p) => p.connected);
    if (playersList.length === 0) return room;

    const sortedByScore = [...playersList].sort((a, b) => b.score - a.score);
    const mvp = sortedByScore[0];

    const awards: PartyAward[] = [];

    awards.push({
      id: 'award_mvp',
      title: '👑 全场最强显眼包之王',
      badge: '🏆',
      winnerId: mvp.id,
      winnerName: mvp.name,
      winnerAvatar: mvp.avatar,
      tag: '战绩封神 · 派对聚光灯焦点',
      reason: `以最高积分 ${mvp.score} 统治全场，手速、演技与脑洞全面碾压！`,
      roast: `AI认证：今天最大的显眼包非你莫属，全场的风头都被你一个人占尽了！`,
    });

    const secondPlayer = sortedByScore[1] || mvp;
    awards.push({
      id: 'award_actor',
      title: '🎭 奥斯卡隐匿影帝奖',
      badge: '🕶️',
      winnerId: secondPlayer.id,
      winnerName: secondPlayer.name,
      winnerAvatar: secondPlayer.avatar,
      tag: '心机深沉 · 骗过全场不脸红',
      reason: '在《谁是卧底》与对峙辩论中面不改色，演技逼真到连测谎仪都自闭。',
      roast: 'AI认证：建议出门直接去横店试镜，这演技不去拍谍战片真是屈才了！',
    });

    const thirdPlayer = sortedByScore[2] || sortedByScore[0];
    awards.push({
      id: 'award_picasso',
      title: '🎨 赛博抽象派画神',
      badge: '🖌️',
      winnerId: thirdPlayer.id,
      winnerName: thirdPlayer.name,
      winnerAvatar: thirdPlayer.avatar,
      tag: '灵魂画手 · 拍卖行顶流',
      reason: '画出的线条突破人类认知维度，在AI艺术拍卖行引发全场哄抢。',
      roast: 'AI认证：毕加索看了连夜撕掉画板，达芬奇见了直呼外星文明！',
    });

    const lowestPlayer = sortedByScore[sortedByScore.length - 1] || sortedByScore[0];
    awards.push({
      id: 'award_dare',
      title: '💣 自爆卡车终身成就奖',
      badge: '🚗',
      winnerId: lowestPlayer.id,
      winnerName: lowestPlayer.name,
      winnerAvatar: lowestPlayer.avatar,
      tag: '越挫越勇 · 大冒险受刑专业户',
      reason: '抢答从不缺席，答错从不服输，转盘惩罚被他一个人承包！',
      roast: 'AI认证：虽败犹荣！聚会全靠你兜底活跃气氛，全场最敬业的搞笑担当！',
    });

    room.ceremony = {
      active: true,
      awards,
      mvpId: mvp.id,
      mvpName: mvp.name,
      mvpAvatar: mvp.avatar,
      mvpScore: mvp.score,
      totalRoundsPlayed: Math.max(3, Object.keys(room.players).length),
      aiHostSpeech: `各位派对玩咖！本届【派对AI狂欢盛典】圆满落幕！感谢【${mvp.name}】的统治级表现与各位戏精的倾情自爆，江湖路远，下局再战！`,
    };

    room.aiMood = 'cheering';
    room.aiQuip = `🎉【派对终局AI颁奖典礼】盛大开幕！恭喜【${mvp.name}】加冕显眼包之王，快来领取专属战报！`;
    return room;
  }

  closePartyCeremony(roomId: string): RoomState | null {
    const room = this.getRoom(roomId);
    if (!room || !room.ceremony) return null;
    room.ceremony.active = false;
    room.gameType = 'LOBBY';
    room.aiMood = 'normal';
    room.aiQuip = '颁奖盛典圆满结束！大家可以在大厅稍作休息，随时开启下一场狂欢！';
    return room;
  }
}
