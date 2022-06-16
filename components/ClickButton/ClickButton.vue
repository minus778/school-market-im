<template>
	<view class="button" @click="$emit('clickto')">{{title}}</view>
</template>

<script>
	export default {
		name:"button",
		data() {
			return {
			};
		},
		props:['title']
	}
</script>

<style lang="scss">
.button{
		background-color: #ff7300;
		width: 500rpx;
		height: 74rpx;
		line-height: 74rpx;
		position: fixed;
		bottom: 70rpx;
		left: 50%;
		transform: translateX(-50%);
		text-align: center;
		color: white;
		border-radius: 74rpx;
	}
</style>
