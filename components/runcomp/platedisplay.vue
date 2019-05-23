<template>
  <div 
    v-if="weight !== null && barbellWeight !== null" 
    v-html="plates"/>
</template>

<script>
export default {
  name: 'PlateDisplay',
  props: {
    weight: {
      type: [Number],
      default: 0
    },
    barbellWeight: {
      type: [Number],
      default: 20
    }
  },

  computed: {
    plates: function() {
      console.log(`weight ${this.weight}`)
      if (
        this.weight == null ||
        this.weight == 0 ||
        this.barbellWeight == null
      ) {
        return ''
      }

      let plate25 = '<div class="kg25 weight plate plate-kg25"></div>'
      let plate20 = '<div class="kg20 weight plate plate-kg20"></div>'
      let plate15 = '<div class="kg15 weight plate plate-kg15"></div>'
      let plate10 = '<div class="kg10 weight plate plate-kg10"></div>'
      let plate5 = '<div class="kg5 weight plate plate-kg5"></div>'
      let plate2d5 = '<div class="kg2d5 weight plate plate-kg2d5"></div>'
      let plate1d25 = '<div class="kg1d25 weight plate plate-kg1d25"></div>'
      let plate0d5 = '<div class="kg0d5 weight plate plate-kg0d5"></div>'
      let plate0d25 = '<div class="kg0d25 weight plate plate-kg0d25"></div>'
      let plateCollar =
        '<div class="plate" style="height: 50px; border-color: transparent; line-height: 0px"><svg width="20" height="10"><line x1="5" y1="10" x2="5" y2="0" style="stroke: #606060; stroke-width: 2"/><line x1="5" y1="0" x2="25" y2="0" style="stroke: #606060; stroke-width: 4"/></svg><div class="plate plate-kgClamp" style="margin-top: 0px"></div></div>'

      let plates = ''
      let remainingWeight = (this.weight - this.barbellWeight) / 2
      while (remainingWeight > 0) {
        if (remainingWeight >= 25) {
          remainingWeight = remainingWeight - 25
          plates = plates + plate25
        } else if (remainingWeight >= 20) {
          remainingWeight = remainingWeight - 20
          plates = plates + plate20
        } else if (remainingWeight >= 15) {
          remainingWeight = remainingWeight - 15
          plates = plates + plate15
        } else if (remainingWeight >= 10) {
          remainingWeight = remainingWeight - 10
          plates = plates + plate10
        } else if (remainingWeight >= 5) {
          remainingWeight = remainingWeight - 5
          plates = plates + plate5
        } else if (remainingWeight >= 2.5) {
          remainingWeight = remainingWeight - 2.5
          plates = plates + plate2d5
        } else if (remainingWeight >= 1.25) {
          remainingWeight = remainingWeight - 1.25
          plates = plates + plate1d25
        } else if (remainingWeight >= 0.5) {
          remainingWeight = remainingWeight - 0.5
          plates = plates + plate0d5
        } else if (remainingWeight >= 0.25) {
          remainingWeight = remainingWeight - 0.25
          plates = plates + plate0d25
        }

        if (remainingWeight < 0.25) remainingWeight = 0
      }

      plates = plates + plateCollar

      return plates
    }
  }
}
</script>

<style>
.weight:after {
  /*font-family: icomoon;*/
  font-size: 50px;
  line-height: 200px;
  color: #fff;
}

.kg25:after {
  /*content: "\e907";*/
}

.kg20:after {
  /*content: "\e906";*/
}

.kg15:after {
  /*content: "\e905";*/
  line-height: 170px;
  color: #000;
}

.kg10:after {
  /*content: "\e904";*/
  line-height: 145px;
}

.kg5:after {
  /*content: "\e903";*/
  color: #000;
  font-size: 50px;
  line-height: 110px;
}

.kg2d5:after {
  /*content: "\e902";*/
  color: #fff;
  font-size: 45px;
  line-height: 80px;
}

.kg1d25:after {
  /*content: "\e908";*/
  font-size: 35px;
  line-height: 40px;
  color: #000;
}

.kg0d5:after {
  /*content: "\e900";*/
  color: #000;
  font-size: 35px;
  line-height: 40px;
}

.kg0d25:after {
  /*content: "\e901";*/
  color: #000;
  font-size: 35px;
  line-height: 40px;
}

.plate {
  width: 20px;
  height: 200px;
  line-height: 30px;
  text-align: center;
  border-style: solid;
  border-color: gray;
  border-width: 1px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 3px;
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}

.plate-kg25 {
  background: #ff0000;
}

.plate-kg20 {
  background: #1673b6;
}

.plate-kg15 {
  background: #edd406;
  height: 170px;
}

.plate-kg10 {
  background: #007555;
  height: 140px;
}

.plate-kg5 {
  background: #f0f0f0;
  height: 110px;
}

.plate-kg2d5 {
  background: #3d3d3d;
  height: 80px;
}

.plate-kg1d25 {
  background: #bebebe;
  height: 40px;
}

.plate-kg0d5 {
  background: #bebebe;
  height: 40px;
}

.plate-kg0d25 {
  background: #bebebe;
  height: 40px;
}

.plate-kgClamp {
  background: #bebebe;
  height: 30px;
}
</style>
