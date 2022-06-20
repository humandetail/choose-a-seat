export default {
  methods: {
    getCoordinate (axis, value) {
      const { size, gap, offset } = this
      
      return offset[axis] + (size + gap) * (value - 1)
    }
  }
}
