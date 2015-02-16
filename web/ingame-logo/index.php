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
</body>
