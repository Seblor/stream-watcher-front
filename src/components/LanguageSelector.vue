<template>
  <select class="lang-selector" v-model="selectedLang" @change="changeLanguage($event.target.value)">
    <option
    v-for="language in languages"
    :key="language.shortName"
    :value="language.shortName"
    >
    {{language.name}}
    </option>
  </select>
</template>

<script>
import lang from '../lang'

export default {
  computed: {
    languages () {
      return Object.keys(lang.messages).map(shortName => ({
        shortName,
        name: lang.messages[shortName].name
      }))
    },
    selectedLang: {
      get () {
        return lang.locale
      },
      set (newLang) {
        localStorage.setItem('selected-lang', newLang)
        lang.locale = newLang
      }
    }
  },
  methods: {
    changeLanguage (newLang) {
      lang.locale = newLang
    }
  }
}
</script>

<style>
.lang-selector {
  background-color: hsl(216, 7%, 25%);
  border-radius: 15px;
  padding: 5px;
  color: #aaaaff;
  margin: 25px;
}
</style>
