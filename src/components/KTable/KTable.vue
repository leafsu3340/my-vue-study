<script>
export default {
  name: 'KTable',
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    defaultSort: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {
    this.orderField = this.defaultSort.prop ? this.defaultSort.prop : '';
    this.orderBy = this.defaultSort.order ? this.defaultSort.order : '';
  },
  data() {
    return {
      orderBy: 'desc',
      orderField: ''
    };
  },
  computed: {
    columns() {
      return this.$slots.default
        .filter(vnode => vnode.tag)
        .map(item => {
          const {
            data: { attrs, scopedSlots }
          } = item;
          const column = { ...attrs, sortable: Object.hasOwnProperty.call(attrs, 'sortable') };
          if (scopedSlots) {
            // 自定义列表模板
            column.renderCell = (row, i) => {
              return scopedSlots.default({ row, $index: i }) // 返回的是VNode
            };
          } else {
            // 设置prop的情况
            column.renderCell = row => {
              return row[column.prop];
            };
          }
          return column;
        });
    },
    rows() {
      return this.data.map(item => {
        const row = {};
        this.columns.forEach(c => {
          row.renderCell = c.renderCell;
          row[c.prop] = item[c.prop];
        });
        return row;
      });
    }
  },
  methods: {
    toggleSort(field) {
      const by = this.orderBy === 'desc' ? 'asc' : 'desc';
      this.sort(field, by);
    },
    sort(field, by) {
      this.orderField = field;
      this.orderBy = by;

      this.data.sort((a, b) => {
        const v1 = a[this.orderField];
        const v2 = b[this.orderField];

        if (typeof v1 === 'number') {
          return this.orderBy === 'desc' ? v2 - v1 : v1 - v2;
        } else {
          // string
          return this.orderBy === 'desc' ? v2.localeCompare(v1) : v1.localeCompare(v2);
        }
      });
    }
  },
  render() {
    return (
      <table class="k-table">
        <thead>
          <tr>
            {this.columns.map(column => {
              let arrow = '↓↑';
              if (Object.hasOwnProperty.call(column, 'sortable') && column.prop) {
                if (this.orderField === column.prop) {
                  arrow = this.orderBy === 'desc' ? '↓' : '↑';
                }
                return (
                  <th>
                    <span onClick={() => this.toggleSort(column.prop)}>
                      <i>{arrow}</i>
                      {column.label}
                    </span>
                  </th>
                );
              } else {
                return <th>{column.label}</th>;
              }
            })}
          </tr>
        </thead>
        <tbody>
          {this.data.map((row, index) => {
            return (
              <tr>
                {this.columns.map(col => {
                  return <td>{col.renderCell(row, index)}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
};
</script>

<style scoped>
.k-table th {
  width: 100px;
  border: 1px solid rgb(49, 49, 49);
}

.k-table td {
  width: 100px;
  border: 1px solid rgb(49, 49, 49);
}
</style>