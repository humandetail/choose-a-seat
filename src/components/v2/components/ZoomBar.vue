<template>
  <div class="zoom-bar">
    <a-slider
      :value="value"
      :max="100"
      :min="0"
      :tip-formatter="val => val + '%'"
      @change="$emit('input', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'ZoomBar',

  props: {
    value: {
      type: Number,
      default: 100,
      validator: val => {
        return val >= 0 && val <= 100
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.zoom-bar {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9;
  width: 100%;
  padding: 6px 16px;
  border-radius: 12px;
  background-color: rgba(200, 200, 200, .3);

  .ant-slider {
    margin: 0
  }
}
</style>
