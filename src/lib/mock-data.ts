// ==========================================
// lib/mock-data.ts — すべてのダミーデータ集約
// ==========================================

// ---- 型定義 ----
export interface UserProfile {
  nickname: string;
  goal: string;
  age: number;
  location: string;
  job: string;
  height: number;
  bodyType: string;
  hobbies: string[];
  bio: string;
}

export interface PersonalityScores {
  extraversion: number;      // 外向性
  agreeableness: number;     // 協調性
  conscientiousness: number; // 誠実性
  emotionalStability: number;// 情緒安定性
  openness: number;          // 開放性
  dominance: number;         // 主導性
}

export interface Recommendation {
  id: string;
  name: string;
  age: number;
  location: string;
  job: string;
  hobbies: string[];
  matchScore: number;
  reason: string;
  personalityScores: PersonalityScores;
  bio: string;
  height: number;
  bodyType: string;
}

export interface PersonalityQuestion {
  id: number;
  text: string;
  axis: keyof PersonalityScores;
}

export interface SelfAnalysisTrend {
  label: string;
  value: number; // 0-100
  description: string;
}

export interface SelfAnalysisPattern {
  title: string;
  description: string;
}

export interface TalkAnalysisResult {
  temperature: number;
  temperatureLabel: string;
  metrics: {
    replyInterval: string;
    messageRatio: string;
    questionCount: string;
    topicSpread: string;
  };
  interestedTopics: string[];
  warnings: string[];
  suggestions: {
    text: string;
    reason: string;
  }[];
}

export interface CalendarEvent {
  id?: string;
  date: string;
  title: string;
  time: string;
  type?: "date" | "call";
}

export interface DatePlan {
  id: string;
  date: string;
  time: string;
  title: string;
  location: string;
  partner: {
    name: string;
    age: number;
    location: string;
    job: string;
    hobbies: string[];
    bio: string;
    compatibility: string;
    commonPoints: string[];
    conversationTips: string[];
  };
  purposeOptions: string[];
  questionOptions: string[];
  actionOptions: string[];
  initialPurpose: string;
  initialQuestions: string[];
  initialActions: string[];
  fashionCaption: string;
}

export interface PastDate {
  id: string;
  date: string;
  partnerName: string;
  title: string;
  reviewCompleted: boolean;
}

// ---- データ ----
export const currentUser: UserProfile = {
  nickname: "たいき",
  goal: "10月末までに、自然体で話せる相手と3回デートする",
  age: 27,
  location: "東京都",
  job: "エンジニア",
  height: 173,
  bodyType: "普通",
  hobbies: ["カフェ巡り", "映画鑑賞", "料理", "ランニング"],
  bio: "都内でエンジニアをしています。休日はカフェ巡りや映画を見るのが好きです。お互いに自然体でいられる関係が理想です。"
};

export const personalityQuestions: PersonalityQuestion[] = [
  { id: 1, text: "初対面の相手にも自分から話しかけるほうだ", axis: "extraversion" },
  { id: 2, text: "グループの中心にいるより周りで聞いている方が好きだ", axis: "extraversion" },
  { id: 3, text: "相手が困っていたらすぐに手を差し伸べたい", axis: "agreeableness" },
  { id: 4, text: "意見が対立したときは相手の気持ちを優先する", axis: "agreeableness" },
  { id: 5, text: "決める前に情報を集めきりたい", axis: "conscientiousness" },
  { id: 6, text: "約束の時間に遅れることがほとんどない", axis: "conscientiousness" },
  { id: 7, text: "相手の感情の変化に気づきやすい", axis: "emotionalStability" },
  { id: 8, text: "予定が崩れるとストレスを感じる", axis: "emotionalStability" },
  { id: 9, text: "まだ行ったことのない場所に行くのにワクワクする", axis: "openness" },
  { id: 10, text: "新しい考え方を聞くと試したくなる", axis: "openness" },
  { id: 11, text: "デートの計画は自分が立てたい", axis: "dominance" },
  { id: 12, text: "二人の関係のペースは自分が決める方が安心する", axis: "dominance" },
];

export const personalityResult: PersonalityScores = {
  extraversion: 72,
  agreeableness: 85,
  conscientiousness: 68,
  emotionalStability: 60,
  openness: 78,
  dominance: 55,
};

export const personalityLabels: Record<keyof PersonalityScores, string> = {
  extraversion: "外向性",
  agreeableness: "協調性",
  conscientiousness: "誠実性",
  emotionalStability: "情緒安定性",
  openness: "開放性",
  dominance: "主導性",
};

export const recommendations: Recommendation[] = [
  {
    id: "1",
    name: "あおい",
    age: 25,
    location: "東京都",
    job: "デザイナー",
    hobbies: ["カフェ巡り", "イラスト", "映画鑑賞"],
    matchScore: 94,
    reason: "あなたの「じっくり関係を作る」傾向と、相手の返信ペースが合っています",
    bio: "UI/UXデザイナーをしています。休日は美術館やカフェ巡りが好き。穏やかに過ごせる人と出会いたいです。",
    height: 162,
    bodyType: "やや細め",
    personalityScores: { extraversion: 65, agreeableness: 88, conscientiousness: 72, emotionalStability: 70, openness: 82, dominance: 45 },
  },
  {
    id: "2",
    name: "みさき",
    age: 26,
    location: "神奈川県",
    job: "看護師",
    hobbies: ["ヨガ", "料理", "旅行"],
    matchScore: 89,
    reason: "共感力の高さと、コミュニケーションのテンポが近いです",
    bio: "看護師5年目です。仕事柄不規則ですが、お休みの日はヨガや料理を楽しんでいます。",
    height: 158,
    bodyType: "普通",
    personalityScores: { extraversion: 70, agreeableness: 90, conscientiousness: 80, emotionalStability: 65, openness: 68, dominance: 50 },
  },
  {
    id: "3",
    name: "はるか",
    age: 28,
    location: "東京都",
    job: "マーケター",
    hobbies: ["ランニング", "読書", "ワイン"],
    matchScore: 86,
    reason: "趣味の「ランニング」が共通。お互いの活動量が近いです",
    bio: "マーケティングの仕事をしています。朝ランが日課。本とワインが好きな大人のお付き合いを希望します。",
    height: 165,
    bodyType: "スリム",
    personalityScores: { extraversion: 75, agreeableness: 72, conscientiousness: 85, emotionalStability: 74, openness: 80, dominance: 65 },
  },
  {
    id: "4",
    name: "ゆい",
    age: 24,
    location: "千葉県",
    job: "事務職",
    hobbies: ["映画鑑賞", "カメラ", "お菓子作り"],
    matchScore: 82,
    reason: "映画鑑賞の趣味が一致。情緒安定性のバランスが良いです",
    bio: "平日は事務仕事、休日はカメラを持ってお出かけしています。写真好きな方と話してみたいです。",
    height: 155,
    bodyType: "普通",
    personalityScores: { extraversion: 55, agreeableness: 82, conscientiousness: 75, emotionalStability: 78, openness: 70, dominance: 40 },
  },
  {
    id: "5",
    name: "りな",
    age: 27,
    location: "東京都",
    job: "プログラマー",
    hobbies: ["ゲーム", "アニメ", "カフェ巡り"],
    matchScore: 79,
    reason: "IT業界同士で話題が合いやすく、カフェ巡りも共通です",
    bio: "Webエンジニアです。インドア寄りですが、美味しいコーヒーを求めてカフェ巡りするのが好きです。",
    height: 160,
    bodyType: "やや細め",
    personalityScores: { extraversion: 48, agreeableness: 75, conscientiousness: 82, emotionalStability: 62, openness: 72, dominance: 42 },
  },
  {
    id: "6",
    name: "さくら",
    age: 29,
    location: "埼玉県",
    job: "教師",
    hobbies: ["読書", "料理", "ハイキング"],
    matchScore: 76,
    reason: "料理の趣味が共通。協調性のスコアが互いに高いです",
    bio: "小学校の先生をしています。子どもたちから元気をもらっています。穏やかで優しい人が好きです。",
    height: 157,
    bodyType: "普通",
    personalityScores: { extraversion: 68, agreeableness: 92, conscientiousness: 78, emotionalStability: 72, openness: 65, dominance: 48 },
  },
  {
    id: "7",
    name: "まい",
    age: 26,
    location: "東京都",
    job: "営業",
    hobbies: ["テニス", "カラオケ", "旅行"],
    matchScore: 72,
    reason: "開放性スコアが似ており、新しい体験を一緒に楽しめそうです",
    bio: "営業職で毎日人と話しています。休日はアクティブに過ごしたい派。旅行の計画を立てるのが好き！",
    height: 163,
    bodyType: "普通",
    personalityScores: { extraversion: 88, agreeableness: 70, conscientiousness: 65, emotionalStability: 68, openness: 80, dominance: 72 },
  },
  {
    id: "8",
    name: "ことね",
    age: 25,
    location: "神奈川県",
    job: "フリーランスライター",
    hobbies: ["読書", "映画鑑賞", "散歩"],
    matchScore: 68,
    reason: "映画鑑賞の趣味が共通。静かに楽しみを共有できるタイプです",
    bio: "フリーランスで記事を書いています。家でまったりするのが好きですが、散歩も大好きです。",
    height: 156,
    bodyType: "やや細め",
    personalityScores: { extraversion: 40, agreeableness: 80, conscientiousness: 70, emotionalStability: 75, openness: 85, dominance: 35 },
  },
];

export const selfAnalysisTrends: SelfAnalysisTrend[] = [
  { label: "関係構築のスピード", value: 35, description: "じっくりと時間をかけて信頼を築くタイプ" },
  { label: "感情表現の量", value: 62, description: "適度に感情を伝えるが、深い部分は慎重" },
  { label: "相手への依存度", value: 28, description: "自立したパートナーシップを好む傾向" },
];

export const selfAnalysisPatterns: SelfAnalysisPattern[] = [
  { title: "相手に合わせすぎるパターン", description: "初期の段階で相手のペースに合わせすぎて、自分の希望を後回しにする傾向があります。2〜3回目のデートで自分の意見を積極的に出してみましょう。" },
  { title: "連絡頻度のミスマッチ", description: "自分の返信ペースが相手より遅いと不安を感じやすい一方、自分からの発信は控えめです。「自分から1日1回は連絡する」ルールを試してみては。" },
  { title: "理想化しやすい傾向", description: "良い印象を受けた相手を理想化しがちです。3回目のデートまでは「観察期間」と意識すると、冷静に相性を見極められます。" },
];

export const selfAnalysisStrengths: string[] = [
  "傾聴力が高い", "相手の変化に気づく", "約束を守る", "穏やかな雰囲気"
];

export const selfAnalysisChallenges: string[] = [
  "自己開示のタイミング", "NOと言う勇気", "期待値のコントロール"
];

export const selfAnalysisSummary = "あなたは「じっくり関係を育てる堅実型」です。相手の気持ちを大切にしながらも、自分のペースを持つことでより良い関係を築けるでしょう。";

export type ChatMessage = { role: "ai" | "user"; text: string };

export const chatMessages: ChatMessage[] = [
  { role: "ai", text: "こんにちは！自己分析をはじめましょう。あなたの恋愛や人間関係について、いくつか質問させてくださいね。" },
  { role: "ai", text: "これまでで、いちばん自然に話せた相手はどんな人でしたか？" },
];

export const chatResponses = [
  "なるほど、それは興味深いですね。自然体でいられる相手には、共通点がありそうです。次の質問です——関係が途切れるとき、原因はどこにあったと思いますか？",
  "ありがとうございます。自分を振り返ることは勇気がいることですね。では、理想のパートナーとはどのような時間の過ごし方をしたいですか？",
  "素敵ですね。あなたの価値観がよく伝わってきます。最後に——恋愛において、自分が一番大切にしていることを一言で表すと何ですか？",
  "ありがとうございました！あなたの回答から、とても誠実で思慮深い方だという印象を受けました。分析結果を下にまとめていますので、ぜひご覧ください。",
];

export const talkAnalysisResult: TalkAnalysisResult = {
  temperature: 72,
  temperatureLabel: "良好、ただしやや一方通行",
  metrics: {
    replyInterval: "平均 23分（相手は 45分）",
    messageRatio: "あなた 62% : 相手 38%",
    questionCount: "あなた 5回 / 相手 2回",
    topicSpread: "4トピック（食事 > 仕事 > 趣味 > 恋愛観）",
  },
  interestedTopics: ["食事の話題", "趣味の深掘り", "週末の予定"],
  warnings: [
    "直近3往復であなたの発話量が相手の2.4倍になっています",
    "相手の質問に対する掘り下げが少なく、話題がすぐ切り替わっています",
  ],
  suggestions: [
    { text: "「この前言ってたお店、どんな雰囲気だった？」", reason: "相手が関心を示した食事の話題を掘り下げることで会話のバランスが改善します" },
    { text: "「今週末って何か予定あるの？」", reason: "相手の返信頻度が上がる週末の話題に寄せることで返信率が向上しやすいです" },
    { text: "「最近ハマってることとかある？」", reason: "オープンクエスチョンで相手の発話量を増やし、バランスを取れます" },
  ],
};

export const calendarEvents: CalendarEvent[] = [
  { id: "date-2026-08-05-misaki", date: "2026-08-05", title: "美咲さんと初回デート", time: "20:00", type: "date" },
  { id: "date-2026-08-09-yuka", date: "2026-08-09", title: "由佳さんとカフェ", time: "14:00", type: "date" },
  { date: "2026-08-12", title: "奈緒さんとオンライン通話", time: "21:00", type: "call" },
  { id: "date-2026-08-15-misaki", date: "2026-08-15", title: "美咲さんと2回目デート", time: "18:00", type: "date" },
  { id: "date-2026-07-27-ayaka", date: "2026-07-27", title: "彩花さんとのカフェ", time: "15:00", type: "date" },
];

export const upcomingDatePlan: DatePlan = {
  id: "date-2026-08-05-misaki",
  date: "2026-08-05",
  time: "20:00",
  title: "美咲さんと初回デート",
  location: "恵比寿のイタリアン",
  partner: {
    name: "美咲",
    age: 26,
    location: "東京都",
    job: "Webデザイナー",
    hobbies: ["カフェ巡り", "映画鑑賞", "美術館"],
    bio: "デザインの仕事をしながら、休日は気になるカフェや展示を巡っています。落ち着いて話せる時間が好きです。",
    compatibility: "穏やかな会話を好む点と、カフェ・映画という共通の趣味が好相性。お互いに相手の話を丁寧に聞くタイプなので、自然体で距離を縮められそうです。",
    commonPoints: ["カフェ巡り", "映画鑑賞", "じっくり関係を築きたい"],
    conversationTips: ["最近行った展示やカフェを聞く", "映画は作品名より感想を深掘りする", "自分のおすすめも一つ伝える"],
  },
  purposeOptions: ["まずは自然に楽しく話す", "次のデートにつなげる", "恋愛観や価値観を知る", "相性を落ち着いて見極める"],
  questionOptions: ["休日の過ごし方", "連絡頻度の好み", "食事やお店の好み", "将来の働き方", "恋愛で大切にしていること"],
  actionOptions: ["自分から質問を3つする", "相手の話を最後まで聞く", "自分の希望も一度伝える", "次につながる話題を作る", "帰宅後にお礼の連絡をする"],
  initialPurpose: "まずは自然に楽しく話す",
  initialQuestions: ["休日の過ごし方", "食事やお店の好み"],
  initialActions: ["相手の話を最後まで聞く", "自分の希望も一度伝える"],
  fashionCaption: "アイボリーのニットポロとネイビーのパンツで、清潔感と話しかけやすさを両立。ブラウンのローファーと腕時計を加え、初回のディナーデートに合う少しだけ上品な印象に。",
};

export const datePlans: DatePlan[] = [
  {
    ...upcomingDatePlan,
    id: "date-2026-07-27-ayaka",
    date: "2026-07-27",
    time: "15:00",
    title: "彩花さんとのカフェ",
    location: "中目黒のカフェ",
    partner: {
      name: "彩花", age: 27, location: "東京都", job: "編集者",
      hobbies: ["読書", "喫茶店", "写真"],
      bio: "出版社で編集の仕事をしています。静かな喫茶店と写真を撮りながら歩く休日が好きです。",
      compatibility: "落ち着いた場所を好み、相手の話を丁寧に聞く点が共通しています。好きな本やお店の話から自然に価値観を知れそうです。",
      commonPoints: ["落ち着いたカフェが好き", "じっくり話したい", "写真や映画に興味がある"],
      conversationTips: ["最近読んだ本を聞く", "好きな街の雰囲気を聞く", "自分の休日の過ごし方も伝える"],
    },
    initialPurpose: "相性を落ち着いて見極める",
    initialQuestions: ["休日の過ごし方", "連絡頻度の好み"],
    initialActions: ["自分から質問を3つする", "相手の話を最後まで聞く"],
  },
  upcomingDatePlan,
  {
    ...upcomingDatePlan,
    id: "date-2026-08-09-yuka",
    date: "2026-08-09",
    time: "14:00",
    title: "由佳さんとカフェ",
    location: "表参道のカフェ",
    partner: {
      name: "由佳", age: 25, location: "神奈川県", job: "広報",
      hobbies: ["旅行", "スイーツ", "ヨガ"],
      bio: "広報の仕事をしています。休日は新しいお店を探したり、ヨガでリフレッシュしています。",
      compatibility: "新しい場所を楽しめる開放性と、穏やかなコミュニケーションのテンポが近い組み合わせです。",
      commonPoints: ["新しいお店が好き", "食べ歩き", "穏やかな会話"],
      conversationTips: ["最近の旅行先を聞く", "おすすめスイーツを聞く", "次に行きたい場所を共有する"],
    },
    initialPurpose: "恋愛観や価値観を知る",
    initialQuestions: ["休日の過ごし方", "恋愛で大切にしていること"],
    initialActions: ["自分の希望も一度伝える", "次につながる話題を作る"],
  },
  {
    ...upcomingDatePlan,
    id: "date-2026-08-15-misaki",
    date: "2026-08-15",
    time: "18:00",
    title: "美咲さんと2回目デート",
    location: "丸の内のビストロ",
    initialPurpose: "次のデートにつなげる",
    initialQuestions: ["将来の働き方", "恋愛で大切にしていること"],
    initialActions: ["自分の希望も一度伝える", "帰宅後にお礼の連絡をする"],
  },
];

export const latestPastDate: PastDate = {
  id: "date-2026-07-27-ayaka",
  date: "2026-07-27",
  partnerName: "彩花",
  title: "彩花さんとのカフェ",
  reviewCompleted: false,
};

export const activityData = [
  { date: "2026-07-27", points: 19 },
  { date: "2026-07-28", points: 4 },
  { date: "2026-07-29", points: 7 },
  { date: "2026-07-30", points: 2 },
  { date: "2026-07-31", points: 6 },
  { date: "2026-08-01", points: 3 },
  { date: "2026-08-02", points: 5 },
];

export const todayHint = "今日のヒント：じっくり型のあなたは、焦らず相手のペースも尊重しましょう。返信を待つ時間も信頼構築の一部です。";

export const hobbyOptions = [
  "カフェ巡り", "映画鑑賞", "料理", "ランニング", "読書", "旅行",
  "ヨガ", "ゲーム", "アニメ", "カメラ", "音楽", "テニス",
  "ハイキング", "イラスト", "お菓子作り", "カラオケ", "散歩", "キャンプ",
  "ボルダリング", "ダンス"
];

export const bodyTypeOptions = ["スリム", "やや細め", "普通", "グラマー", "ぽっちゃり", "こだわらない"];
