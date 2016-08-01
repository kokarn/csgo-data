# CSGO Data
Data for Counter Strike: Global Offensive

## Teams
 * Logo, square with transparent background
 * Steam id (if applicable)
 * CSGOLounge name
 * GosuGamers name and id
 * HLTV name and id
 * LiquidPedia name
 * An unique identifier


 ## Low hanging fruit
 [These are the teams currently missing a highres version of the logo](logos-missing.md)

 ## How do I get team logos in a different size?
 Glad you asked!

 There's a script hosted on [csgo-data](http://csgo-data.com) that does this for you.

 Just go to `csgo-data.com/logos/IDENTIFIER/SIZE`
 #### Examples
 [csgo-data.com/logos/3dmax/64 ](http://csgo-data.com/logos/3dmax/64 )  
 [csgo-data.com/logos/Ninjas in pyjamas/200](http://csgo-data.com/logos/Ninjas in pyjamas/200)

 ## How can I use the data in my project?
 
 If you just want to use the logos or data it's avaialble right here in the repo.

 If you want to use this for some web project or something, there are two examples live on
 [csgo-data.com](http://csgo-data.com).

 For a CSGO server there's a great plugin.
 [Team Logo Manager](https://forums.alliedmods.net/showthread.php?t=258206).
 A SourceMod plugin that let's you select both logo and team-name easily on your own server.

### How do I add a team?

There are three different ways to help out and add a missing team.

#### #1 Create a pull request
This is the best way because it's by far the fastest. If you can, please do this.

#### #2 Create an issue and link to the resources needed
If you don't know how to create a pull request, please [open an
issue](https://github.com/kokarn/csgo-data/issues/new) and attach the files need.

Generally this is the information about the team and a version of the logo in as high a resolution as possible.

#### #3 Create an issue
If you can't find any resources on the team, just [open an
issue](https://github.com/kokarn/csgo-data/issues/new) and we'll look into adding it ASAP.


## Miscellaneous
### I want to host this and force downloads the same way you are doing!
Of course you want! This is the config we use on [csgo-data.com](http://csgo-data.com) on nginx


```
location ~* ^/teams/(.*\.)(cfg|zip|png)$ {
    add_header Content-Disposition "attachment; filename=$1$2";
    default_type application/octet-stream;
}
```
If you use apache, this is a .htaccess file that goes in the '/teams/' directory

```
<FilesMatch ".(cfg|zip|png)$">
    ForceType application/octet-stream
    Header set Content-Disposition attachment
</FilesMatch>
```

### How do I set up my own logo generation script with nginx?
Easy peasy, just add this to your nginx config

```
location /logos {
        rewrite ^/logos/(.*)/(.*)$ /logos/index.php?team=$1&size=$2 last;
}
```

## Legal

#### __All logos and trademarks are the property of their respective owners!__

If you represent the entity that has the rights over a logo and you want,
for whatever reason, that logo removed from this project, [open an
issue](https://github.com/kokarn/csgo-teams/issues/new) requesting its
takedown and we will remove it as soon as possible.

Everything else is licensed under MIT.
