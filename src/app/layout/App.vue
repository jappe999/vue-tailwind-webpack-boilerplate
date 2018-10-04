<template>
  <div class="flex font-sans">
    <say-hello />
  </div>
</template>

<script>
import SayHello from '~/components/SayHello'

export default {
  el: '#app',

  components: {
    SayHello,
  }
}
</script>
