<template>
    <transition-group name="fade" tag="div">
        <slot></slot>
    </transition-group>
</template>
<script>
    export default {
        data() {
            return {
            }
        }
    }
</script>
<style>
    .fade-enter-active,
    .fade-leave-active {
        transition: all .5s ease;
    }
    .fade-leave-active {
        position: absolute;
    }
    .fade-enter {
        transform: translateX(50px);
        opacity: 0;
    }
    .fade-leave-to {
        transform: translateX(-50px);
        opacity: 0;
    }
</style>