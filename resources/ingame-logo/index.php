<!DOCTYPE html>
<head>
    <title>
        CSGO Team In-Game Logos
    </title>
    <meta charset="utf8">
</head>
<body>
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
</body>
