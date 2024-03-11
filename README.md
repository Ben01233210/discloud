Hallo Herr Lundschien,

Sie brauchen ein google konto damit mit welchem sie sich anmelden, dieses müssen wir momentan aber noch händisch freischalten, dafür müssten sie uns eine email addressse von ihnen schicken, die mit einem aktiven google konto verküpft ist. Wir schalten sie dann so schnell wie möglich frei, damit sie die Webseite nutzen können.

Im "about" ist die Funktionsweise unser Webseite grob erklärt.
Für sie aber hier eine ausführliche Version + eine grobe Übersicht, wie unser code strukturiert ist und was was macht





"about"

We are three students from Berlin, and this Website was created as a software project for one of our classes. It is supposed to be a free, unlimited cloud storage, which only requires you to have a Discord and a Google account, where you can upload and download files.

The reason you require a discord account is, that we take the files you want to upload, split them into 25 Megabyte chunks, and then upload these to the discord server of your choice. Then when you want to download your file, we take all these chunks and combine them into the original file.

But for the program to know which chunks to combine, we needed a database, which is why you need to log in with your Google account. Upon doing that, a text file is created in your Google Drive, serving as the database - We know it is a bit ironic that you need another cloud storage for this one to work. 

We hope you enjoy your free, unlimited cloud storage!


"tutorial"

1. For this cloud storage to work, you are required to have a Discord and Google account. If you do not have those, please create them before continuing.
2. If you have your accounts, please open Discord and create a new server. Then open the settings for a text channel and go to integration. There you will have the option to create a new WebHook. Please do so and click on the WebHook, to access the WebHook-URL, you will need this later.
3. Now go to discloud-neon.vercel.app and log in with your Google account. If this is the first time logging in, you will be asked to insert a WebHook-URL, here you paste the URL from step 2.
4. Your Discloud is now ready