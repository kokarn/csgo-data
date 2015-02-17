<!DOCTYPE html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
        CSGO Team In-game logos
    </title>
    <link href="//cdn.jsdelivr.net/bootswatch/3.3.1.2/paper/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <h2>
            Available teams
        </h2>
        <ul>
            <?php
                $items = scandir( '.' );
                foreach( $items as $item ) :
                    if( $item == '.' || $item == '..' ) :
                        continue;
                    endif;

                    ?>
                    <li>
                        <a href="<?php echo $item; ?>">
                            <?php echo str_replace( '.png', '', $item ); ?>
                        </a>
                    </li>
                    <?php
                endforeach;
            ?>
        </ul>
    </div>
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-3953312-24', 'auto');
        ga('send', 'pageview');
    </script>
</body>
