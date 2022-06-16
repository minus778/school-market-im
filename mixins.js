export const countImageHome2 = {
  data(){
    return{
    list3:[]   ,//将请求到的数据，图片一但计算好了高度就push进list3，list3用于信息流组件渲染
    }
  },
  methods: {
    countImages(value) {
      uni.getImageInfo({
        src: "https://cc.yixun.club/image/165292474853622.jpg",
        success: function(image) {
          console.log("image")
        },
        fail: function(err) {
          console.log("失败")
        }
        })
          let that = this
          value.forEach(item => {
            uni.getImageInfo({
              src: item.photo.split(',')[0],
              success: function(image) {
                // console.log("上传的图片宽度",image.width);
                // console.log("上传的图片的高度",image.height);
                if (image.width > image.height) {
                  item.photo = item.photo.split(',')[0] + ',w'
                  that.list3.push(item)
                } else {
                  item.photo = item.photo.split(',')[0] + ',h'
                  that.list3.push(item)
                }
              },
              fail: function(err) {
                item.photo = item.photo.split(',')[0] + ',n'
                that.list3.push(item)
              }
            })
          })
          // console.log("this.list3",this.list3)
        },
  }
}