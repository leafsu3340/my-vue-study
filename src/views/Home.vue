<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <!-- <h4>counter is</h4>
    <h3>{{$store.state.counter}}</h3>
    <h3>{{$store.getters.doubleCounter}}</h3>
    <button @click="$store.commit('add')">mutations</button>
    <button @click="$store.state = 3">setState</button>
    <button @click="$store.dispatch('add')">actions</button>
    <button @click="showNotice">showNotice</button>-->
    <k-table :data="tableData" :default-sort="{prop: 'date', order:'desc'}">
      <k-table-column prop="date" label="⽇期" sortable></k-table-column>
      <k-table-column prop="name" label="名称" sortable></k-table-column>
      <k-table-column prop="score" label="得分" sortable></k-table-column>
      <k-table-column label="操作">
        <template v-slot="scope">
          <span class="cell-span">{{ scope.row.operation }}</span>
        </template>
      </k-table-column>
    </k-table>
  </div>
</template>

<script>
// @ is an alias to /src
import { KTable, KTableColumn } from '@/components/KTable/index';

export default {
  name: 'Home',
  components: {
    KTable,
    KTableColumn
  },
  data() {
    return {
      tableData: [
        { date: '2021-03-11', name: '小米', score: 98, operation: '增加' },
        { date: '2021-03-12', name: '华为', score: 99, operation: '增加' },
        { date: '2021-03-13', name: '苹果', score: 88, operation: '删除' },
        { date: '2021-03-14', name: 'oppo', score: 97, operation: '修改' }
      ]
    };
  },
  methods: {
    showNotice() {
      this.$notice({
        title: 'I am a Notice',
        message: 'ahahhaha',
        duration: 3000
      });
    }
  }
};
</script>
