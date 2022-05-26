<template>
  <div id="app">
    <div class="choose-seat">
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
    </div>
  </div>
</template>

<script>
import ChooseSeat from './components/ChooseSeat.vue'

export default {
  name: 'App',
  components: {
    ChooseSeat
  },

  data () {
    return {
      width: 1000,
      height: 1000,

      statusMap: {
        idle: ['#66DE93', '空閑中Idle', true, true],
        reserved: ['#FFF323', '已預約未占用Reserved', true, false],
        claimed: ['#FF884B', '占用中Claimed', true, false],
        breakdown: ['#EF4F4F', '故障Breakdown', true, false],
        unavailable: ['rgba(0, 0, 0, 0.15)', '禁用中Unavailable', false, false]
      },

      coordinate: {
        xAxis: {
          value: 30,
          text: '横向'
        },
        yAxis: {
          value: 15,
          text: '纵向'
        }
      },

      mockData: [
        {
          x: 5,
          y: 2,
          info: {
            status: 'reserved',
            displayName: 'GG570'
          }
        },
        {
          x: 4,
          y: 3,
          info: {
            status: 'reserved',
            displayName: 'GG571'
          }
        },
        {
          x: 3,
          y: 4,
          info: {
            status: 'idle',
            displayName: 'GG572'
          }
        },
        {
          x: 2,
          y: 5,
          info: {
            status: 'claimed',
            displayName: 'GG574'
          }
        },
        {
          x: 3,
          y: 6,
          info: {
            status: 'idle',
            displayName: 'GG576'
          }
        },
        {
          x: 4,
          y: 7,
          info: {
            status: 'claimed',
            displayName: 'GG578'
          }
        },
        {
          x: 5,
          y: 8,
          info: {
            status: 'claimed',
            displayName: 'GG580'
          }
        },
        {
          x: 6,
          y: 7,
          info: {
            status: 'idle',
            displayName: 'GG579'
          }
        },
        {
          x: 7,
          y: 6,
          info: {
            status: 'claimed',
            displayName: 'GG577'
          }
        },
        {
          x: 8,
          y: 5,
          info: {
            status: 'claimed',
            displayName: 'GG575'
          }
        },
        {
          x: 7,
          y: 4,
          info: {
            status: 'unavailable',
            displayName: 'GG573'
          }
        }
      ],

      module: ['coordinate', 'legend', 'statistics'],

      statisticsSetting: {
        title: '统计',
        thead: ['状态', '数量']
      }
    }
  },

  computed: {
    seatData () {
      const {
        mockData,
        coordinate: {
          xAxis: { value: column },
          yAxis: { value: row }
        }
      } = this

      const data = []

      for (let x = 1; x <= column; x++) {
        for (let y = 1; y <= row; y++) {
          let item = mockData.find(item => item.x === x && item.y === y)
          data.push([
            x,
            y,
            item?.info || {}
          ])
        }
      }

      return data
    },

    /**
     * 统计
     */
    statistics () {
      const { seatData } = this

      return seatData.reduce((prev, [,,info]) => {
        if (info?.status) {
          if (!prev[info.status]) {
            prev[info.status] = 0
          }
          prev[info.status]++
        }
        return prev
      }, {})
    }
  },

  methods: {
    handleSeatClick (info) {
      console.log('seat clicked.', info)
      // @example
      if (info.data.status === 'idle') {
        this.mockData = this.mockData.map(item => {
          if (item.x === info.x && item.y === info.y) {
            item.info.status = 'claimed'
          }

          return item
        })
      }
    },

    handleCheckboxClick (e) {
      const { value } = e.target

      if (this.module.includes(value)) {
        this.module = this.module.filter(item => item !== value)
      } else {
        this.module.push(value)
      }
    }
  }
}
</script>
