import type { TableStructure } from "types";

export const baseUrl = "https://www.hellowork.mhlw.go.jp/kensaku/GECA110010.do";

export const tableStructure: TableStructure[] = [
  {
    key: "main",
    header: null,
    children: [
      "求人番号",
      "受付年月日",
      "紹介期限日",
      "受理安定所",
      "求人区分",
      "オンライン自主応募の受付",
      "産業分類",
      "トライアル雇用併用の希望",
      // "ＰＲロゴマークＰＲロゴのご案内",
    ],
  },
  {
    key: "office",
    header: {
      id: "ID_GECZ25041Z",
      text: "求人事業所",
    },
    children: ["事業所番号", "事業所名", "所在地", "ホームページ"],
  },
  {
    key: "description",
    header: {
      id: "ID_GECZ25042Z",
      text: "仕事内容",
    },
    children: [
      "職種",
      "仕事内容",
      "雇用形態",
      "派遣・請負等",
      "雇用期間",
      "就業場所",
      "マイカー通勤",
      "転勤の可能性",
      "年齢",
      "学歴",
      "必要な経験等",
      "必要なＰＣスキル",
      "必要な免許・資格",
      "試用期間",
    ],
  },
  {
    key: "wages",
    header: {
      id: "ID_GECZ25043Z",
      text: "賃金・手当",
    },
    children: [
      "ａ ＋ ｂ（固定残業代がある場合はａ ＋ ｂ ＋ ｃ）",
      "基本給（ａ）",
      "定額的に支払われる手当（ｂ）",
      "固定残業代（ｃ）",
      "その他の手当等付記事項（ｄ）",
      "月平均労働日数",
      "賃金形態等",
      "通勤手当",
      "賃金締切日",
      "賃金支払日",
      "昇給",
      "賞与",
    ],
  },
  {
    key: "working_hours",
    header: {
      id: "ID_GECZ25044Z",
      text: "労働時間",
    },
    children: [
      "就業時間",
      "時間外労働時間",
      "休憩時間",
      "年間休日数",
      "休日等",
      "週所定労働日数",
    ],
  },
  {
    key: "working_conditions",
    header: {
      id: "ID_GECZ25045Z",
      text: "その他の労働条件等",
    },
    children: [
      "加入保険等",
      "企業年金",
      "退職金共済",
      "退職金制度",
      "定年制",
      "再雇用制度",
      "勤務延長",
      "入居可能住宅",
      "利用可能託児施設",
    ],
  },
  {
    key: "company",
    header: {
      id: "ID_GECZ25046Z",
      text: "会社の情報",
    },
    children: [
      "従業員数",
      "設立年",
      "資本金",
      "労働組合",
      "事業内容",
      "会社の特長",
      "役職／代表者名",
      "法人番号",
      "就業規則",
      "育児休業取得実績",
      "介護休業取得実績",
      "看護休暇取得実績",
      "外国人雇用実績",
      "UIJターン歓迎",
    ],
  },
  {
    key: "selection",
    header: {
      id: "ID_GECZ25047Z",
      text: "選考等",
    },
    children: [
      "採用人数",
      "選考方法",
      "選考結果通知",
      "求職者への通知方法",
      "選考日時等",
      "選考場所",
      "応募書類等",
      "応募書類の返戻",
      "選考に関する特記事項",
      "担当者",
    ],
  },
  {
    key: "special_notes",
    header: {
      id: "ID_GECZ25048Z",
      text: "求人に関する特記事項",
    },
    children: ["求人に関する特記事項"],
  },
  {
    key: "pr",
    header: {
      id: "ID_GECZ25062Z",
      text: "求人・事業所PR情報\n「求人・事業所PR情報」は求人票には表示されません。",
    },
    children: [
      "事業所からのメッセージ",
      "支店・営業所・工場等",
      "年商",
      "主要取引先",
      "関連会社",
      "職務給制度",
      "復職制度",
      "福利厚生の内容",
      "研修制度",
      "事業所に関する特記事項",
      "両立支援の内容",
    ],
  },
  {
    key: "disabilities",
    header: {
      text: "障害者に対する配慮に関する状況",
    },
    children: [
      "企業在籍型ジョブコーチの有無",
      "エレベーター",
      "点字設備",
      "階段の手すり",
      "建物内の車いす移動",
      "休憩室",
      "バリアフリー対応トイレ",
      "障害者に配慮したその他の施設・設備等",
    ],
  },
];
export const spreadSheetColumns = tableStructure
  .map((item) => item.children)
  .flat()
  .map((key) => {
    if (key === "事業所名") {
      return ["事業所名", "事業所名カナ"];
    }
    if (key === "所在地") {
      return ["事業所郵便番号", "事業所住所"];
    }
    if (key === "年齢") {
      return ["年齢下限", "年齢上限"];
    }

    return key;
  })
  .flat();
export const spreadSheetColumnsMap = Object.fromEntries(
  spreadSheetColumns.map((item, index) => [item, index])
);
export const blackListedColumns = ["ＰＲロゴマークＰＲロゴのご案内"];
