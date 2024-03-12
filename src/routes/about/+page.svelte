
<!-- kurz die About page-->
<style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        color: #333;
        margin: 0;
        padding: 0;
    }

    .container {
        max-width: 40%;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        color: black;
        font-weight: bold;
        font-size: 30px;
        margin-bottom: 30px;
    }

    p {
        line-height: 1.6;
        margin-bottom: 15px;
    }
</style>

<div class="container">
    <h1>About</h1>

    <p>Welcome to our page!</p>

    <p>We are three students from Berlin, and we've created this website as a software project for one of our classes. Our aim was to provide a free and unlimited cloud storage solution, requiring only a Discord and a Google account. With our service, you can upload and download files without worrying about storage limitations.</p>

    <p>To facilitate this, we split uploaded files into 25-megabyte chunks and store them on the Discord server of your choice. When you download a file, these chunks are reassembled to restore the original file.</p>

    <p>To manage the chunk mapping, we utilize a database, hence the requirement to log in with your Google account. Upon logging in, a text file is created in your Google Drive, serving as the database - a bit ironic that another cloud storage is needed for this one to work, isn't it?</p>

    <p>We hope you enjoy our free, unlimited cloud storage!</p>
</div>
