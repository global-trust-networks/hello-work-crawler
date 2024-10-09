export type KeySelectorPair = { key: string; selector: string };
export type TableStructure = {
  children: string[];
  header: { id?: string; text: string } | null;
  key: string;
};
