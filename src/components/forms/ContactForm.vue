<template>
  <section class="max-w-4xl p-5 m-0 mx-auto">
    <form action="https://api.web3forms.com/submit" method="POST" id="form">
      <input
        type="hidden"
        name="access_key"
        value="fccf1818-dcda-46b1-adba-ffe18993c3bb"
      />
      <input type="hidden" name="subject" value="New Submission from Web3Forms" />
      <input
        type="hidden"
        name="redirect"
        value="https://web3forms.com/success"
      />
      <input
        type="checkbox"
        name="botcheck"
        id="botcheck"
        style="display: none"
      />
      <section class="mb-6">
        <label
          class="block mb-2 text-xs font-semibold uppercase text-slate-700/60 font-navigation dark:text-slate-50"
          for="full-name"
        >
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name-field"
          placeholder="John Doe"
          required
          class="w-full px-3 py-2 mb-2 placeholder-gray-300 border border-gray-300 rounded-md dark:text-slate-50 focus:outline-hidden focus:ring-3 focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
        />
      </section>
      <section class="mb-6">
        <label
          for="email"
          class="block mb-2 text-xs font-semibold uppercase text-slate-700/60 font-navigation dark:text-slate-50"
          >Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email field"
          placeholder="you@company.com"
          required
          class="w-full px-3 py-2 mb-2 placeholder-gray-300 border border-gray-300 rounded-md dark:text-slate-50 focus:outline-hidden focus:ring-3 focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
        />
      </section>
      <section class="mb-6">
        <label
          for="phone"
          class="block mb-2 text-xs font-semibold uppercase text-slate-700/60 font-navigation dark:text-slate-50"
          >Phone Number</label
        >
        <input
          type="text"
          name="phone"
          id="phone field"
          placeholder="+1 (555) 1234-567"
          required
          class="w-full px-3 py-2 mb-2 placeholder-gray-300 border border-gray-300 rounded-md dark:text-slate-50 focus:outline-hidden focus:ring-3 focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
        />
      </section>
      <section class="mb-6">
        <label
          for="message"
          class="block mb-2 text-xs font-semibold uppercase text-slate-700/60 font-navigation dark:text-slate-50"
          >Your Message</label
        >
        <textarea
          rows="5"
          name="message"
          id="message field"
          placeholder="Your Message"
          class="w-full px-3 py-2 mb-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-hidden focus:ring-3 dark:text-slate-50 focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
          required
        >
        </textarea>
      </section>
      <section class="mb-6">
        <button
          type="submit"
          class="md:align-center px-5 pt-2.5 pb-2.5 text-white font-bold text-xs leading-normal uppercase rounded-lg transition duration-150 ease-in-out bg-linear-to-br from-indigo-400 to-pink-500 md:flex hover:text-whiteHover hover:shadow-lg hover:bg-opacity-40 hover:outline-1 dark:hover:shadow-cyan-500/60 hover:transition-colors hover:duration-200 focus:text-white focus:shadow-lg focus:outline-hidden focus:ring-1 active:text-white active:shadow-lg"
        >
          Send Message
        </button>
      </section>
    </form>
  </section>
</template>

<script setup>
// No script logic needed for this component
</script>

<style scoped>
/* Scoped styles for this component if any */
</style>
