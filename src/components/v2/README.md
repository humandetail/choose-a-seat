# 选座系统

`template`

```vue
<template>
  <div id="app">
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
import ChooseSeat from '@/components/ChooseSeat'
import {
  statusMap,
  statusTextMap,
  colorsMap
} from '@/components/ChooseSeat/constants'

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
```