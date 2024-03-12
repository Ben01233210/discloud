<script>
    import "../app.css";
    // das ist das navigation menu das wird ueber jeder seite angezeigt 
</script>

<div class="bg-background">
    <div class="flex justify-center text-foreground py-2 border-b gap-2">
        <a href="/" class="font-bold">Discloud</a>
        <a href="/" class="text-primary hover:secondary">Home</a>
        <a href="/about" class="text-blue-500 hover:text-blue-700">About</a>
        <a href="/tutorial" class="text-blue-500 hover:text-blue-700"
            >Tutorial</a
        >
    </div>
    <slot />

    <style>
        nav {
            @apply shadow-sm bg-white py-4 px-8;
        }
        nav a {
            @apply mx-4;
        }
    </style>
</div>
