<script lang="ts">
    let webhook = "";
    let login = async () => {
        let data = await fetch("https://api.discloud.us/login", {
            method: "POST",
            body: JSON.stringify({
                webhook: webhook
            })
        })
    }
</script>


<div class="flex flex-col m-8 p-8 bg-gray-100 rounded-lg shadow-lg gap-2">
    <h1 class="font-bold text-3xl self-center">Welcome to Discloud</h1>
    <p>Discloud is a free cloud storage platform that allows you to securely store and access your files from anywhere. With Discloud, you can easily upload, organize, and share your documents, photos, videos, and more. Experience the convenience and flexibility of cloud storage with Discloud.</p>
    <a href="/tutorial" class="bg-blue-500 hover:bg-blue-700 text-white 
    font-bold py-2 px-4 rounded self-center w-min">Tutorial</a>
    <input bind:value={webhook} class="border-2 border-gray-300 rounded-lg p-2 w-2/4 self-center" type="text" placeholder="Webhook">
    <button on:click={login} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center w-min">Login</button>
</div>
