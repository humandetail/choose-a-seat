<template>
  <svg
    :width="width * zoom"
    :height="height * zoom"
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 坐标轴 -->
    <g name="coordinate">
      <!-- x轴 -->
      <g name="xAxis">
        <text
          v-for="x in col"
          :key="`xaxis-${x}`"
          :x="getCoordinate('x', x) + 0.5 * size"
          :y="getCoordinate('y', 0) + 0.5 * size"
          text-anchor="middle"
          dominant-baseline="middle"
          :style="`font-size: ${fontSize}px`"
        >
          {{ x }}
        </text>
        <line
          :x1="getCoordinate('x', 1) - gap * 1.5"
          :y1="getCoordinate('y', 1) - gap * 1.5"
          :x2="getCoordinate('x', col + 1)"
          :y2="getCoordinate('y', 1) - gap * 1.5"
          stroke="#364064"
        />
        <path
          :d="`
            M ${getCoordinate('x', col + 1)} ${getCoordinate('y', 1) - gap * 1.5}
            l -${gap} -${gap / 2}
            l 0 ${gap}
            Z
          `"
          fill="#364064"
        />
      </g>

      <!-- y轴 -->
      <g name="yAxis">
        <text
          v-for="y in row"
          :key="`yaxis-${y}`"
          :x="getCoordinate('x', 0) + 0.3 * size"
          :y="getCoordinate('y', y) + 0.5 * size"
          text-anchor="middle"
          dominant-baseline="middle"
          :style="`font-size: ${fontSize}px`"
        >
          {{ y }}
        </text>
        <line
          :x1="getCoordinate('x', 1) - gap * 1.5"
          :y1="getCoordinate('y', 1) - gap * 1.5"
          :x2="getCoordinate('x', 1) - gap * 1.5"
          :y2="getCoordinate('y', row + 1)"
          stroke="#364064"
        />
        <path
          :d="`
            M ${getCoordinate('x', 1) - gap * 1.5} ${getCoordinate('y', row + 1)}
            l -${gap / 2} -${gap}
            l ${gap} 0
            Z
          `"
          fill="#364064"
        />
      </g>
    </g>

    <!-- 格子 -->
    <g name="box">
      <rect
        v-for="item of boxes"
        :key="`box-${item.x}-${item.y}`"
        :data-x="item.x"
        :data-y="item.y"
        :x="getCoordinate('x', item.x)"
        :y="getCoordinate('y', item.y)"
        :width="size"
        :height="size"
        fill="none"
        stroke="#C3C4C6"
      />
    </g>
  </svg>
</template>

<script>
import SeatMixin from './mixins'
export default {
  name: 'BackBoard',

  mixins: [SeatMixin],

  props: {
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
    }
  },

  computed: {
    width () {
      const { col, size, gap, offset } = this

      return col * (size + gap) + offset.x + size // 留一个空位
    },

    height () {
      const { row, size, gap, offset } = this

      return row * (size + gap) + offset.y + size // 留一个空位
    },

    offset () {
      const { size, gap } = this

      return {
        x: size + gap * 2,
        y: size + gap * 2
      }
    },

    fontSize () {
      return this.size / 2
    },

    boxes () {
      const { row, col } = this

      const boxes = []

      for (let y = 1; y <= row; y++) {
        for (let x = 1; x <= col; x++) {
          boxes.push({
            x,
            y
          })
        }
      }

      return boxes
    }
  }
}
</script>

<style>

</style>