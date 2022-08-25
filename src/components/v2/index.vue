<template>
  <section
    class="choose-seat-container"
    :style="wrapperStyle"
  >
    <ZoomBar
      v-model="slideZoom"
    />

    <div class="wrapper">
      <main class="main-wrapper">
        <BackBoard
          v-bind="$props"
          :zoom="zoom"
        />

        <TheTemplate
          v-for="item of groupsData"
          :key="item.id"
          v-bind="item"
          :zoom="zoom"
          :statusMap="statusMap"
          :statusTextMap="statusTextMap"
          :colorsMap="colorsMap"
          @checked="$emit('checked', item.id, $event)"
          @group-checked="$emit('group-checked', $event)"
          @template-drag-end="$emit('template-drag-end', $event)"
        />
      </main>

      <aside
        class="aside-wrapper"
      >
        <div
          v-if="legendData && legendData.length > 0"
          class="legend-fluid"
        >
          <div
            v-for="item of legendData"
            :key="item.value"
            class="legend-item"
            :data-status="item.status"
          >
            <div
              class="color"
              :style="{ backgroundColor: item.backgroundColor || 'transparent' }"
            />

            <div class="text">
              {{ item.text }}
            </div>
          </div>
        </div>

        <div class="extra">
          <slot />
        </div>
      </aside>
    </div>
  </section>
</template>

<script>
import ZoomBar from './components/ZoomBar.vue'
import BackBoard from './components/BackBoard.vue'
import TheTemplate from './components/TheTemplate.vue'

let id = 1
export default {
  name: 'ChooseSeat',

  components: {
    ZoomBar,
    BackBoard,
    TheTemplate
  },

  props: {
    // 行数量，y轴
    row: {
      type: Number,
      default: 10
    },

    // 列数量，x轴
    col: {
      type: Number,
      default: 20
    },

    defaultZooom: {
      type: Number,
      default: 100,
      validator (val) {
        return val >= 0 && val <= 100
      }
    },

    groups: {
      type: Array,
      default: () => []
    },

    legend: {
      type: Array,
      default: () => []
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
    },

    wrapperStyle: {
      type: Object,
      default: () => ({
        width: '480px',
        height: '480px'
      })
    }
  },

  data () {
    return {
      // 格子大小
      size: 32,

      // 格子之间的间隙
      gap: 8,

      // 缩放比率
      slideZoom: 100
    }
  },

  computed: {
    groupsData () {
      const { groups, $props, size, gap } = this

      return groups.map(item => ({ id: id++, ...$props, size, gap, ...item }))
    },

    legendData () {
      const { legend = [], statusMap, statusTextMap, colorsMap } = this

      return legend.map(item => ({
        value: item,
        text: statusTextMap[item],
        backgroundColor: colorsMap[item],
        status: statusMap[item]
      }))
    },

    zoom () {
      return this.slideZoom / 100
    }
  },

  watch: {
    defaultZooom: {
      immediate: true,
      handler (val) {
        this.slideZoom = val ?? 100
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-seat-container {
  position: relative;
  padding: 32px 16px 16px;
  overflow: auto;
  background-color: #fafafa;

  .zoom-bar {
    opacity: 0;
  }

  &:hover {
    .zoom-bar {
      opacity: 1;
    }
  }

  .wrapper {
    display: flex;
  }

  .main-wrapper {
    position: relative;
  }

  .aside-wrapper {
    padding: 32px 16px;

    .legend-item {
      display: flex;
      align-items: center;

      .color {
        width: 20px;
        height: 20px;
        border: 1px solid #f1f1f1;
      }

      .text {
        flex: 1;
        margin-left: 8px;
        white-space: nowrap;
      }

      & + .legend-item {
        margin-top: 16px;
      }
    }

    .extra {
      margin-top: 32px;
    }
  }
}
</style>
