<template>
  <!-- 座位表 -->
  <svg
    id="J_choose-seat"
    ref="wrapper"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${boxSize * (xAxis + 12)} ${boxSize * (yAxis + 3)}`"
    xmlns="http://www.w3.org/2000/svg"
    @mousewheel.stop.prevent="handleMouseWheel"
    @mousedown.stop="handleMouseDown"
  >
    <g
      :transform="`scale(${scale}) translate(${translate[0]},${translate[1]})`"
      transform-origin="center"
    >
      <g v-if="module.includes('coordinate')" id="coordinate">
        <!-- x轴 -->
        <rect
          :x="1 * boxSize"
          :y="0.15 * boxSize"
          :width="boxSize * xAxis"
          :height="boxSize - 0.4 * boxSize"
          :rx="(boxSize - 0.4 * boxSize) / 2"
          :ry="(boxSize - 0.4 * boxSize) / 2"
          fill-opacity="0.1"
        />
        <text
          v-for="x in xAxis"
          :key="`xaxis-${x}`"
          :x="boxSize * (x + 0.5)"
          :y="boxSize * 0.5"
          text-anchor="middle"
          dominant-baseline="middle"
          :style="`font-size: ${boxSize / 2}px; line-height: ${boxSize}px`"
        >
          {{ x }}
        </text>

        <!-- y轴 -->
        <rect
          :x="0.2 * boxSize"
          :y="1 * boxSize"
          :width="boxSize - 0.4 * boxSize"
          :height="boxSize * yAxis"
          :rx="(boxSize - 0.4 * boxSize) / 2"
          :ry="(boxSize - 0.4 * boxSize) / 2"
          fill-opacity="0.1"
        />
        <text
          v-for="y in yAxis"
          :key="`yaxis-${y}`"
          :x="boxSize * 0.5"
          :y="boxSize * (y + 0.5)"
          text-anchor="middle"
          dominant-baseline="middle"
          :style="`font-size: ${boxSize / 2}px; line-height: ${boxSize}px`"
        >
          {{ y }}
        </text>

        <!-- 格子统计 -->
        <g>
          <text
            :x="boxSize * xAxis / 2"
            :y="boxSize * (yAxis + 1.5)"
            text-anchor="middle"
            dominant-baseline="middle"
            :style="`font-size: ${boxSize / 2}px; line-height: ${boxSize}px`"
          >
            横向 &emsp; {{ xAxis }}
          </text>
          <g>
            <text
              :x="boxSize * (xAxis + 1.5)"
              :y="boxSize * yAxis / 2"
              :transform="`rotate(90, ${boxSize * (xAxis + 1.5)}, ${boxSize * yAxis / 2})`"
              rotate="-90"
              style="letter-spacing: .4em"
              text-anchor="middle"
              dominant-baseline="middle"
              :style="`font-size: ${boxSize / 2}px; line-height: ${boxSize}px`"
            >
              纵向
            </text>
            <text
              :x="boxSize * (xAxis + 1.6)"
              :y="boxSize * (yAxis / 2 + 1)"
              text-anchor="middle"
              dominant-baseline="middle"
              :style="`font-size: ${boxSize / 2}px; line-height: ${boxSize}px`"
            >
              {{ yAxis }}
            </text>
          </g>
        </g>
      </g>

      <!-- 座位格子 -->
      <g id="seat">
        <template v-for="([x, y, data]) in seatData">
          <rect
            :key="`box-${x}-${y}`"
            :width="boxSize"
            :height="boxSize"
            :x="boxSize * x"
            :y="boxSize * y"
            :class="`box box-${x}-${y}`"
            :stroke="'#333'"
            :fill="getBoxBgColor(data.status)"
          >
          </rect>

          <foreignObject
            :key="`box-text-${x}-${y}`"
            :x="boxSize * x"
            :y="boxSize * y"
            :width="boxSize"
            :height="boxSize"
          >
            <body xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; margin: 0; padding: 0;">
              <p
                style="
                  box-sizing: border-box;
                  width: 100%;
                  height: 100%;
                  margin: 0;
                  padding: 3px;
                  line-height: 1.1;
                  word-break: break-all;
                  cursor: pointer;
                "
                :style="{
                  border: checked[0] === x && checked[1] === y && clickableStatus.includes(data.status)
                    ? '2px solid #00f'
                    : '2px solid transparent',
                  fontSize: `${boxSize / 3}px`
                }"
                @click="handleSeatClick(x, y, data, $event)"
              >
                {{ data.displayName }}
              </p>
            </body>
          </foreignObject>
        </template>
      </g>

      <!-- 图例 legend -->
      <g v-if="module.includes('legend')" id="legend">
        <rect
          v-for="(item, index) in status"
          :key="`legend-box-${index}`"
          :x="boxSize * (xAxis + 2)"
          :y="boxSize * (1 + index) + (boxSize / 4 * index)"
          :width="boxSize"
          :height="boxSize"
          :fill="getBoxBgColor(item)"
          stroke="#333"
        />

        <text
          v-for="(item, index) in status"
          :key="`legend-text-${index}`"
          :x="boxSize * (xAxis + 2) + (boxSize * 1.1)"
          :y="boxSize * (1.5 + index) + (boxSize / 4 * index)"
          dominant-baseline="middle"
          :style="`font-size: ${boxSize / 2}px; line-height: ${boxSize}px`"
        >
          {{ getStatusDisplayName(item) }}
        </text>
      </g>

      <!-- 统计面板 statistics -->
      <g v-if="module.includes('statistics')" id="statistics">
        <foreignObject
          :x="boxSize * (xAxis + 2)"
          :y="boxSize * (3 + status.length)"
          :width="boxSize * 6"
          :height="boxSize * (statisticsArray.length + 6)"
        >
          <body xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; margin: 0; padding: 0;">
            <p
              :style="`
                margin: 0 0 ${boxSize / 2}px 0;
                font-weight: 700;
                font-size: ${boxSize / 1.5}px;
              `"
            >
              {{ statisticsSetting.title }}
            </p>
            <table
              border
              :style="`
                width: 100%;
                border-collapse: collapse;
                background: #f8f8f8;
                font-size: ${boxSize / 2}px;
              `"
            >
              <thead>
                <tr>
                  <th
                    v-for="(item, index) in statisticsSetting.thead"
                    :key="index"
                    width="50"
                    align="center"
                    style="text-algin: center"
                  >
                    {{ item }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="([key, value]) of statisticsArray"
                  :key="key"
                >
                  <td align="center" style="padding: 6px 8px; text-algin: center">{{ key }}</td>
                  <td align="center" style="padding: 6px 8px; text-algin: center">{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </body>
        </foreignObject>
      </g>
    </g>
  </svg>
</template>

<script>
import throttle from 'lodash.throttle'

export default {
  name: 'ChooseSeat',

  props: {
    /**
     * @param { object } value - [bgColor, displayName, clickable, checkable]
     * @param { string } bgColor - 背景色
     * @param { string } displayName - 说明文本，用于 legend
     * @param { boolean } clickable - 是否可以点击，用于点击时展示蓝色边框
     * @param { boolean} checkable - 是否可以选中座位
     *
     * @example
     * {
     *   default: ['', '', false, false],
     *   free: ['green', '空闲中', true, true],
     *   checked: ['ren', '已占用', false, false]
     * }
     */
    statusMap: {
      type: Object,
      required: true,
      default: () => ({})
    },

    /**
     * @param { [x, y, info] } value
     * @param { number } x
     * @param { number } y
     * @param { Object } info object || {}
     * @param { string } info.status
     * @param { string } [info.displayName]
     */
    seatData: {
      type: Array,
      required: true,
      default: () => []
    },

    coordinate: {
      type: Object,
      default: () => ({
        xAxis: { value: 1, text: '' },
        yAxis: { value: 1, text: '' }
      })
    },

    statistics: {
      type: Object,
      default: () => ({})
    },

    width: {
      type: Number,
      default: 1000
    },

    height: {
      type: Number,
      default: 1000
    },

    module: {
      type: Array,
      default: () => ['coordinate', 'legend', 'statistics']
    },

    statisticsSetting: {
      type: Object,
      default: () => ({
        title: '统计',
        thead: ['状态', '数量']
      })
    }
  },

  data () {
    return {
      boxSize: 32,

      checked: [],
      scale: 1,
      translate: [0, 0]
    }
  },

  computed: {
    xAxis () {
      return this.coordinate?.xAxis?.value || 1
    },

    yAxis () {
      return this.coordinate?.yAxis?.value || 1
    },

    status () {
      return Object.keys(this.statusMap)
    },

    clickableStatus () {
      return Object.entries(this.statusMap).map(([key, [, , clickable]]) => clickable ? key : '').filter(Boolean)
    },

    statisticsArray () {
      return Object.entries(this.statistics).map(([key, value]) => [key, value])
    }
  },

  created () {
    this.handleMouseWheel = throttle(this._handleMouseWheel, 8)
    this.handleMouseMove = throttle(this._handleMouseMove, 8)
  },

  methods: {
    _handleMouseWheel (e) {
      const { ctrlKey, metaKey, deltaY } = e
      if (ctrlKey || metaKey) {
        e.preventDefault()

        if (deltaY > 0) {
          this.scale = Math.max(0.1, this.scale - 0.04)
          return
        }

        if (deltaY < 0) {
          this.scale = Math.min(5, this.scale + 0.04)
        }
      }
    },

    handleMouseDown (e) {
      this.startCoordinate = [e.clientX, e.clientY]
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },

    _handleMouseMove (e) {
      const { ctrlKey, metaKey, clientX, clientY } = e
      if (ctrlKey || metaKey) {
        if (ctrlKey || metaKey) {
          e.preventDefault()
          e.stopPropagation()
          this.translate = [
            this.translate[0] + (clientX - this.startCoordinate[0]),
            this.translate[1] + (clientY - this.startCoordinate[1])
          ]

          this.startCoordinate = [clientX, clientY]
        }
      }
    },

    handleMouseUp (e) {
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },

    getBoxBgColor (status) {
      if (!status) {
        return 'transparent'
      }

      const { statusMap = {} } = this

      return statusMap[status]?.[0] || 'transparent'
    },

    getStatusDisplayName (status) {
      if (!status) {
        return ''
      }

      const { statusMap = {} } = this

      return statusMap[status]?.[1] || ''
    },

    /**
     * 座位格子点击
     * @param { number } x
     * @param { number } y
     * @param { Object } data
     * @param { Object } e
     */
    handleSeatClick (x, y, data, e) {
      this.checked = [x, y]
      this.$emit('seat-click', {
        x,
        y,
        data,
        clientX: e.clientX,
        clientY: e.clientY
      })
    }
  }
}
</script>

<style scoped>
svg {
  user-select: none;
}
foreignObject,
foreignObject * {
  background-color: transparent;
}
</style>
