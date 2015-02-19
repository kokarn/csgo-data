# CSGO Data
Data for Counter Strike: Global Offensive

For teams:
 * Logo
 * Steam "id"
 * CSGOLounge "id"
 * GosuGamers name and id

[SourceMod Plugin for TeamLogos and TeamNames](https://forums.alliedmods.net/showthread.php?t=258206)

----
## How do I add a team?

There are three different ways to help out and add a missing team.

#### #1 Create a pull request
This is the best way because it's by far the fastest. If you can, please do this.

#### #2 Create an issue and link to the resources needed
If you don't know how to create a pull request, please [open an
issue](https://github.com/kokarn/csgo-teams/issues/new) and attach the files need.

Generally this is the information about the team and a version of the logo in as high a resolution as possible.

#### #3 Create an issue
If you can't find any resources on the team, just [open an
issue](https://github.com/kokarn/csgo-teams/issues/new) and we'll look into adding it ASAP.

----
### I want to host this and force downloads the same way you are doing!
Of course you want! This is the config we use on [csgo-data.com](http://csgo-data.com)

.htaccess (this goes in the '/teams/' directory)

```
<FilesMatch ".(cfg|zip|png)$">
    ForceType application/octet-stream
    Header set Content-Disposition attachment
</FilesMatch>
```
nginx

```
location ~* ^/teams/(.*\.)(cfg|zip|png)$ {
    add_header Content-Disposition "attachment; filename=$1$2";
    default_type application/octet-stream;
}
```

---
## Legal

#### __All logos and trademarks are the property of their respective owners!__

If you represent the entity that has the rights over a logo and you want,
for whatever reason, that logo removed from this project, [open an
issue](https://github.com/kokarn/csgo-teams/issues/new) requesting its
takedown and we will remove it as soon as possible.
