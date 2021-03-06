import {IProd} from "../../Components/Repository/interface";

const mockingProds: IProd[] = [
    ["1", "苹果", "红富士"],
    ["2", "西瓜", "无籽"],
    ["3", "iPad", "2018款"],
    ["4", "亚麻", ""],
    ["5", "水杯", "星巴克"],
    ["6", "碎纸机", "晨光"],
    ["7", "叉车", "后备仓"],
    ["8", "纸巾", "维达"],
    ["9", "计算机", "ThinkPad"],
    ["10", "原油", ""],
    ["11", "货车", "三菱"],
    ["12", "玩具积木", "乐高"]
].map(e => ({
    prod_id: e[0],
    prod_name: e[1],
    prod_desc: e[2]
}));
export default mockingProds;