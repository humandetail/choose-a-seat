<template>
  <section class="choose-seat-container">
    <main class="main-wrapper">
      <BackBoard
        v-bind="$props"
      />

      <TheTemplate
        v-for="item of groupsData"
        :key="item.id"
        v-bind="item"
        @checked="$emit('checked', item.id, $event)"
      />
    </main>

    <aside class="aside-wrapper">
      <div
        v-if="legend && legend.length > 0"
        class="legend-fluid"
      >
        <div
          v-for="item of legend"
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
  </section>
</template>

<script>
import BackBoard from './components/BackBoard.vue'
import TheTemplate from './components/TheTemplate.vue'

let id = 1
export default {
  name: 'ChooseSeat',

  components: {
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

    zoom: {
      type: Number,
      default: 1,
      validator (val) {
        return val >= 0 && val <= 1
      }
    },

    groups: {
      type: Array,
      default: () => []
    },

    legend: {
      type: Array,
      default: () => []
    }
  },

  data () {
    return {
      // 格子大小
      size: 32,

      // 格子之间的间隙
      gap: 8,
    }
  },

  computed: {
    groupsData () {
      const { groups, $props, size, gap } = this

      return groups.map(item => ({ id: id++, ...$props, size, gap, ...item }))
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-seat-container {
  display: flex;

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
      }

      .text {
        flex: 1;
        margin-left: 8px;
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