<script>
	import "../app.css"
</script>
<nav class="flex justify-center">
	<a href="/" class="font-bold">Discloud</a>
	<a href="/" class="text-blue-500 hover:text-blue-700">Home</a>
	<a href="/about" class="text-blue-500 hover:text-blue-700">About</a>
	<a href="/tutorial" class="text-blue-500 hover:text-blue-700">Tutorial</a>
</nav>
<slot></slot>

<style>
	nav {
		@apply shadow-sm bg-white py-4 px-8;
	}
	nav a {
		@apply mx-4;
	}
	
</style>
