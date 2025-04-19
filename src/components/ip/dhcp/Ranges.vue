<script setup>
const props = defineProps({
  range: {
    type: String,
    required: true,
  },
});
import { ArrowRight } from 'lucide-vue-next';

let from = '';
let to = '';
if(props.range.split('/').length !== 2) {
  from = props.range.split('-')[0];
  to = props.range.split('-')[1];
}else{
  const expoent = Number(props.range.split('/')[1]);
  from = props.range.split('/')[0]
  to = from.split('.').map((octet, index) => {
    if (index === 3) {
      return Number(octet) + Math.pow(2, 32 - expoent) - 1;
    } 
    return Number(octet)
  }).join('.');
}

</script>

<template>
  <div class="flex items-center">
   <div class="border-2 border-slate-400 rounded-md p-1">{{ from }}</div>
   <component class="mx-2" :is="ArrowRight"/>
   <div class="border-2 border-slate-400 rounded-md p-1">{{ to }}</div>
  </div>
</template>