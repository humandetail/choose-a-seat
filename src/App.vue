<template>
  <div id="app">
    <!-- <div class="choose-seat">
      <header>
        <h1>选座系统</h1>

        <div>按住 “ctrl” 键，点击面板拖拽；滚动缩放</div>
      </header>

      <div>
        <p>列数: <input type="text" v-model.number="coordinate.xAxis.value" /></p>
        <p>行数: <input type="text" v-model.number="coordinate.yAxis.value" /></p>
        <p>宽度：<input type="text" v-model.number="width"></p>
        <p>高度：<input type="text" v-model.number="height"></p>
        <p>模块：
          <label>
            <input
              :checked="module.includes('coordinate')"
              type="checkbox"
              value="coordinate"
              @click="handleCheckboxClick"
            /> 坐标
          </label>
          <label>
            <input
              :checked="module.includes('legend')"
              type="checkbox"
              value="legend"
              @click="handleCheckboxClick"
            /> 图例
          </label>
          <label>
            <input
              :checked="module.includes('statistics')"
              type="checkbox"
              value="statistics"
              @click="handleCheckboxClick"
            /> 统计
          </label>
        </p>
        <div>统计：
          <p>标题：<input type="text" v-model="statisticsSetting.title"></p>
          <p>列1：<input type="text" v-model="statisticsSetting.thead[0]"></p>
          <p>列2：<input type="text" v-model="statisticsSetting.thead[1]"></p>
        </div>
      </div>

      <div class="container" style="width: 800px; height: 800px; overflow: auto">
        <ChooseSeat
          :width="width"
          :height="height"
          :status-map="statusMap"
          :coordinate="coordinate"
          :seat-data="seatData"
          :statistics="statistics"
          :module="module"
          :statistics-setting="statisticsSetting"
          @seat-click="handleSeatClick"
        />
      </div>
    </div> -->

    <div class="container">
      <ChooseSeat
        :col="col"
        :row="row"
        :zoom="zoom"
        :groups="groups"
        :legend="legend"
        @checked="handleSeatClick"
      >
        这里放一个表格
      </ChooseSeat>
    </div>
  </div>
</template>

<script>
// import ChooseSeat from './components/ChooseSeat.vue'
import ChooseSeat from './components/v2/ChooseSeat.vue'
import {
  statusMap,
  statusTextMap,
  colorsMap
} from './components/v2/components/constants'

export default {
  name: 'App',
  components: {
    ChooseSeat
  },

  data () {
    return {
      // 行数量，y轴
      row: 20,

      // 列数量，x轴
      col: 20,

      zoom: 1,

      template1: [
        {
          x: 5,
          y: 4,
          status: 2,
          text: 'GD801',
          id: 1
        },
        {
          x: 4,
          y: 3,
          status: 1,
          text: 'GD802',
          id: 2
        },
        {
          x: 3,
          y: 4,
          status: 1,
          text: 'GD803',
          id: 3
        },
        {
          x: 2,
          y: 5,
          status: 1,
          text: 'GD804',
          id: 4
        },
        {
          x: 3,
          y: 6,
          status: 3,
          text: 'GD805',
          id: 5
        },
        {
          x: 4,
          y: 7,
          status: 5,
          text: 'GD806',
          id: 6
        },
        {
          x: 5,
          y: 8,
          status: 1,
          text: 'GD807',
          id: 7
        },
        {
          x: 6,
          y: 7,
          status: 1,
          text: 'GD808',
          id: 8
        },
        {
          x: 7,
          y: 6,
          status: 4,
          text: 'GD809',
          id: 9
        },
        {
          x: 8,
          y: 5,
          status: 1,
          text: 'GD810',
          id: 10
        },
        {
          x: 7,
          y: 4,
          status: 2,
          text: 'GD811',
          id: 11
        },
        {
          x: 6,
          y: 3,
          status: 1,
          text: 'GD812',
          id: 12
        }
      ],

      legend: [1, 2, 3, 4, 5].map(item => ({
        value: item,
        text: statusTextMap[item],
        backgroundColor: colorsMap[item],
        status: statusMap[item]
      }))
    }
  },

  computed: {
    groups () {
      const { template1, col, row } = this

      return [
        {
          id: 1,
          row: 10,
          col: 10,
          initialValue: template1,
          initialPosition: [1, 1],
          boardSize: [col, row],
          draggable: true,
          selectable: false,
          groupName: {
            name: 'LCKLIBInternet3',
            size: [3, 1],
            position: [3, 4],
            background: 'rgba(0,0,0,.6)',
            color: '#fff'
          }
        },
        {
          id: 2,
          row: 10,
          col: 10,
          initialValue: template1,
          initialPosition: [10, 2],
          boardSize: [col, row],
          draggable: false,
          selectable: true,
          groupName: {
            name: 'LCKLIBInternet4',
            size: [3, 1],
            position: [3, 4],
            background: 'rgba(0,0,0,.6)',
            color: '#fff'
          }
        }
      ]

      
    }
  },

  methods: {
    handleSeatClick (id, data) {
      console.log('seat clicked.', id, data)
    }
  }
}
</script>
