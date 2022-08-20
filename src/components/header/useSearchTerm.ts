import { atom, useAtom } from "jotai";

const searchTermAtom = atom<string>("");

const useSearchTerm = () => useAtom(searchTermAtom);
export default useSearchTerm;
