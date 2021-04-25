/*
function add(num1, num2) {
  return num1 + num2;
}
// 测试套件 test suite
describe("add⽅法", () => {
  // 测试⽤例 test case
  it("应该能正确计算加法", () => {
    // 断⾔ assert
    expect(add(1, 3)).toBe(4);
  });
});
*/
import { mount } from "@vue/test-utils";
import { KTable, KTableColumn } from "@/components/KTable/index";

describe("Ktable组件", () => {
  test("基本表格", () => {
    const template = `<k-table :data="tableData" :default-sort="{prop: 'date', order:'desc'}">
      <k-table-column prop="date" label="⽇期" sortable></k-table-column>
      <k-table-column prop="name" label="名称" sortable></k-table-column>
      <k-table-column prop="score" label="得分" sortable></k-table-column>
      <k-table-column label="操作">
        <template v-slot="scope">
          <span class="cell-span">{{ scope.row.operation }}</span>
        </template>
      </k-table-column>
    </k-table>`;
    const comp = {
      template,
      components: {
        KTable,
        KTableColumn,
      },
      data() {
        return {
          tableData: [
            { date: "2021-03-11", name: "小米", score: 98, operation: "增加" },
            { date: "2021-03-12", name: "华为", score: 99, operation: "增加" },
            { date: "2021-03-13", name: "苹果", score: 88, operation: "删除" },
            { date: "2021-03-14", name: "oppo", score: 97, operation: "修改" },
          ],
        };
      },
    };
    const wrapper = mount(comp);
    expect(wrapper.findAll("tbody").length).toBe(1);
    expect(wrapper.find("thead").exists()).toBe(true);
    expect(wrapper.findAll("tbody>tr").length).toBe(4);
    expect(wrapper.find("tbody>tr").text()).toMatch("2021-03-11");
  });
});
