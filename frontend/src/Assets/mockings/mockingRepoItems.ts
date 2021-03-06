import {IRepoItem} from "../../Components/Repository/interface";

const mockingRepoItems:IRepoItem[] = [
    ["1", "1", "1", "1111"],
    ["2", "1", "2", "2222"],
    ["3", "1", "3", "3333"],
    ["4", "1", "4", "4444"],
    ["5", "2", "1", "5555"],
    ["6", "2", "2", "6666"],
    ["7", "2", "3", "7777"],
    ["8", "2", "4", "8888"],
].map(e => ({
    repo_item: e[0],
    repo_id: e[1],
    prod_id: e[2],
    quantity: e[3]
}));
export default mockingRepoItems;