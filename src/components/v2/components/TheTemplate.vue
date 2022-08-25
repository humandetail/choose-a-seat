<template>
  <svg
    ref="Template"
    class="template-wrapper"
    :class="{
      checked: groupChecked
    }"
    :width="width * zoom"
    :height="height * zoom"
    :viewBox="`0 0 ${width} ${height}`"
    :style="style"
    xmlns="http://www.w3.org/2000/svg"
    @mousedown="handleDragStart"
  >
    <!-- 群组名称区域 -->
    <g
      v-if="groupName"
      name="group-name"
    >
      <rect
        :width="groupNameSize[0]"
        :height="groupNameSize[1]"
        :x="groupNamePosition[0]"
        :y="groupNamePosition[1]"
        rx="4"
        ry="4"
        :fill="groupName.background || 'rgba(0,0,0,.5)'"
      />

      <foreignObject
        :width="groupNameSize[0]"
        :height="groupNameSize[1]"
        :x="groupNamePosition[0]"
        :y="groupNamePosition[1]"
      >
        <body
          xmlns="http://www.w3.org/1999/xhtml"
          style="
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
          "
        >
          <p
            style="
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 4px;
              line-height: 1.1;
              word-break: break-all;
            "
            :style="{
              fontSize: `${size / 3}px`,
              color: groupName.color || '#fff',
              background: groupName.background
            }"
          >
            {{ groupName.name }}
          </p>
        </body>
      </foreignObject>
    </g>

    <!-- 格子 -->
    <g name="seatItem">
      <rect
        v-for="item of initialValue"
        :key="`box-${item.x}-${item.y}`"
        :data-x="item.x"
        :data-y="item.y"
        :x="getCoordinate('x', item.x)"
        :y="getCoordinate('y', item.y)"
        :width="size"
        :height="size"
        :fill="colorFilter(item.status)"
        :stroke="colorFilter(item.status)"
      />

      <foreignObject
        v-for="item of initialValue"
        :key="`box-text-${item.x}-${item.y}`"
        :x="getCoordinate('x', item.x)"
        :y="getCoordinate('y', item.y)"
        :width="size"
        :height="size"
      >
        <body
          xmlns="http://www.w3.org/1999/xhtml"
          style="
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background: transparent;
          "
        >
          <p
            :data-selectable="selectable"
            :data-id="id"
            style="
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 4px;
              line-height: 1.1;
              word-break: break-all;
              border: 1px solid transparent;
              background: transparent;
            "
            :style="{
              fontSize: `${size / 3}px`,
              cursor: selectable ? 'pointer' : 'auto',
              borderColor: currentSelectedItem && currentSelectedItem.x === item.x && currentSelectedItem.y === item.y
                ? '#333'
                : 'transparent'
            }"
            @click="handleSeatClick(item, $event)"
          >
            {{ item.text }}
          </p>
        </body>
      </foreignObject>
    </g>
  </svg>
</template>

<script>
import throttle from 'lodash.throttle'
import SeatMixin from './mixins'

export default {
  name: 'TheTemplate',

  mixins: [SeatMixin],

  props: {
    // 当前模板的 id
    id: {
      type: [String, Number],
      default: 0
    },

    // 行数量，y轴
    row: {
      type: Number,
      default: 30
    },

    // 列数量，x轴
    col: {
      type: Number,
      default: 30
    },

    // 格子大小
    size: {
      type: Number,
      default: 32
    },

    zoom: {
      type: Number,
      default: 1,
      validator (val) {
        return val >= 0 && val <= 1
      }
    },

    // 格子之间的间隙
    gap: {
      type: Number,
      default: 8
    },

    // 是否可拖动
    draggable: {
      type: Boolean,
      default: false
    },
    // 是否可选中
    selectable: {
      type: Boolean,
      default: false
    },
    // 初始位置
    initialPosition: {
      type: Array,
      default: () => [0, 0]
    },
    /**
     * 初始点阵数据
     * @template
     * [
     *   {
     *      x: 0,
     *      y: 0,
     *      status: 1,
     *      text: '',
     *      id: 1
     *   }
     * ]
     */
    initialValue: {
      type: Array,
      default: () => []
    },

    boardSize: {
      type: Array,
      default: () => []
    },

    /**
     * 显示在群组内部的名称
     * @template
     * false
     * @template
     * {
     *    name: 'GROUPNAME',
     *    size: [10, 2],
     *    position: [4, 0]
     * }
     */
    groupName: {
      type: [Object, Boolean],
      default: false
    },

    allowDuplicateCheck: {
      type: Boolean,
      default: false
    },

    // 当前群组是否处于选中状态
    groupChecked: {
      type: Boolean,
      default: false
    },

    statusMap: {
      type: Object,
      default: () => ({
        1: 'idle',
        2: 'reserved',
        3: 'claimed',
        4: 'breakdown',
        5: 'unavailable'
      })
    },

    statusTextMap: {
      type: Object,
      default: () => ({
        1: '空闲中 Idle',
        2: '已预约未占用 Reserved',
        3: '占用中 Claimed',
        4: '故障 Breakdown',
        5: '禁用中 Unavailable'
      })
    },

    colorsMap: {
      type: Object,
      default: () => ({
        1: '#6CE4DF',
        2: '#FDD63D',
        3: '#FFA279',
        4: '#F1525D',
        5: '#E4E4E4'
      })
    }
  },

  data () {
    return {
      translateX: 0,
      translateY: 0,

      startPosition: [],
      cachedTranslate: [],

      cachedPosition: [], // 记录一开始的偏移量，这个数据用于计算最终拖动了几个格子

      currentSelectedItem: null
    }
  },

  computed: {
    width () {
      const { col, size, gap } = this

      return col * (size + gap) - gap
    },

    height () {
      const { row, size, gap } = this

      return row * (size + gap) - gap
    },

    offset () {
      return { x: 0, y: 0 }
    },

    // 限制点
    limitPoints () {
      const { initialValue, size, gap, boardSize, row, col, zoom } = this

      const limit = [
        boardSize[0] || col,
        boardSize[1] || row
      ]

      // 需要补充到四个点
      const result = initialValue.reduce((prev, item) => {
        // 上
        if (prev[0].y === 0 || item.y < prev[0].y) {
          prev.splice(0, 1, item)
        }

        // 右
        if (item.x > prev[1].x) {
          prev.splice(1, 1, item)
        }

        // 下
        if (item.y > prev[2].y) {
          prev.splice(2, 1, item)
        }

        // 左
        if (prev[3].x === 0 || item.x < prev[3].x) {
          prev.splice(3, 1, item)
        }
        return prev
      }, Array(4).fill({ x: 0, y: 0 })).map((item, index) => index % 2 === 0 ? item.y : item.x)

      return [
        // 上
        zoom * (1 - result[0]) * (size + gap),
        // 右
        zoom * (limit[0] - result[1]) * (size + gap),
        // 下
        zoom * (limit[1] - result[2]) * (size + gap),
        // 左
        zoom * (1 - result[3]) * (size + gap)
      ]
    },

    style () {
      const { zoom, size, gap, translateX, translateY, draggable } = this

      return {
        position: 'absolute',
        left: zoom * (size + gap * 2) + 'px',
        top: zoom * (size + gap * 2) + 'px',
        zIndex: draggable ? 2 : 1, // 可拖动的元素层级更高
        transform: `translate(${translateX}px, ${translateY}px)`,
        cursor: draggable ? 'move' : 'auto',
        userSelect: 'none'
      }
    },

    scale () {
      return (this.gap + this.size) * this.zoom
    },

    halfOfScale () {
      return this.scale / 2
    },

    groupNameSize () {
      const { groupName, size, gap } = this

      if (!groupName) {
        return []
      }

      return [
        groupName.size[0] * (size + gap),
        groupName.size[1] * (size + gap)
      ]
    },

    groupNamePosition () {
      const { groupName, size, gap } = this

      if (!groupName) {
        return []
      }

      return [
        groupName.position[0] * (size + gap) - gap / 2,
        groupName.position[1] * (size + gap) - gap / 2
      ]
    }
  },

  watch: {
    initialPosition: {
      deep: true,
      immediate: true,
      handler (val) {
        if (Array.isArray(val)) {
          const [x = 0, y = 0] = val
          const { size, gap, zoom } = this

          this.translateX = x * (size + gap) * zoom
          this.translateY = y * (size + gap) * zoom

          this.cachedPosition = [x, y]
        }
      }
    },

    zoom (newVal, oldValue) {
      this.translateX = this.translateX / oldValue * newVal
      this.translateY = this.translateY / oldValue * newVal
    }
  },

  created () {
    this.handleDrag = throttle(this.handleDrag, 8)

    document.addEventListener('click', this.handleWrapperClick, false)
  },

  beforeDestroy () {
    document.removeEventListener('click', this.handleWrapperClick, false)
  },

  methods: {
    colorFilter (val) {
      return this.colorsMap?.[val] || 'transparent'
    },

    handleDragStart (e) {
      // 更新被选中的模板
      this.$emit('group-checked', this.id)

      if (!this.draggable) {
        return
      }
      this.$refs.Template.classList.add('moving')
      this.startPosition = [
        e.clientX,
        e.clientY
      ]
      this.cachedTranslate = [
        this.translateX,
        this.translateY
      ]

      document.addEventListener('mousemove', this.handleDrag, false)
      document.addEventListener('mouseup', this.handleDragEnd, false)
    },

    handleDrag (e) {
      const { clientX, clientY } = e
      const {
        startPosition: [startX, startY],
        cachedTranslate: [offsetX, offsetY]
      } = this

      const {
        limitPoints: [topLimit, rightLimit, bottomLimit, leftLimit]
      } = this

      let translateX = offsetX + clientX - startX
      let translateY = offsetY + clientY - startY

      this.translateX = Math.min(rightLimit, Math.max(leftLimit, translateX))
      this.translateY = Math.min(bottomLimit, Math.max(topLimit, translateY))
    },

    handleDragEnd (e) {
      this.$refs.Template.classList.remove('moving')

      document.removeEventListener('mousemove', this.handleDrag, false)
      document.removeEventListener('mouseup', this.handleDragEnd, false)

      const { clientX, clientY } = e
      const {
        startPosition: [startX, startY],
        cachedTranslate: [offsetX, offsetY]
      } = this

      const {
        limitPoints: [topLimit, rightLimit, bottomLimit, leftLimit],
        scale,
        halfOfScale
      } = this

      let translateX = offsetX + clientX - startX
      let translateY = offsetY + clientY - startY

      // 吸附
      translateX = translateX % scale > halfOfScale
        ? translateX + scale - translateX % scale
        : translateX - translateX % scale

      // 吸附
      translateY = translateY % scale > halfOfScale
        ? translateY + scale - translateY % scale
        : translateY - translateY % scale

      this.translateX = Math.min(rightLimit, Math.max(leftLimit, translateX))
      this.translateY = Math.min(bottomLimit, Math.max(topLimit, translateY))

      // 提交移动了多少个格子，给上层组件计算最终的坐标
      this.$emit('template-drag-end', {
        id: this.id,
        moveSize: [
          this.translateX / ((this.size + this.gap) * this.zoom) - this.cachedPosition[0],
          this.translateY / ((this.size + this.gap) * this.zoom) - this.cachedPosition[1]
        ]
      })
    },

    handleWrapperClick (e) {
      const target = e.target
      if (
        !this.selectable ||
        !target.getAttribute('data-selectable') ||
        ('' + target.getAttribute('data-id')) !== ('' + this.id)
      ) {
        this.currentSelectedItem = null
      }
    },

    handleSeatClick (item, e) {
      if (!this.selectable) {
        return
      }

      // 是否允许重复点击
      if (!this.allowDuplicateCheck) {
        const { currentSelectedItem } = this

        if (currentSelectedItem?.x === item.x && currentSelectedItem?.y === item.y) {
          return
        }
      }

      this.currentSelectedItem = item

      const { size, gap, translateX, translateY, zoom } = this

      this.$emit('checked', {
        id: item.id,
        // 当前块的位置
        current: {
          x: item.x,
          y: item.y
        },
        // 背景块的位置
        backBoard: {
          x: item.x + translateX / (size + gap) / zoom,
          y: item.y + translateY / (size + gap) / zoom
        },
        position: {
          x: e.clientX,
          y: e.clientY
        }
      })
    }
  }
}
</script>

<style scoped>
.template-wrapper {
  user-select: none;
  z-index: 1;
}
.template-wrapper.moving,
.template-wrapper.checked {
  background-color: rgba(25, 25, 200, .1);
  z-index: 3 !important;
}
</style>
