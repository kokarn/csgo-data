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
        <table class="table">
            <thead>
                <tr>
                    <th>
                        Team
                    </th>
                    <th>
                        Identifier
                    </th>
                    <th>
                        In-game image
                    </th>
                    <th>
                        In-game config
                    </th>
                    <th>
                        In-game image & config zip
                    </th>
                </tr>
            </thead>
            <tbody>
                <?php
                $items = scandir( '.' );
                $teamList = array();
                $skiplist = array( '.', '..', 'index.php' );
                foreach( $items as $item ) :
                    if( in_array( $item, $skiplist ) ) :
                        continue;
                    endif;

                    $dotPosition = strpos( $item, '.' );

                    $identifier = substr( $item, 0, $dotPosition );

                    if( empty( $identifier ) ) :
                        continue;
                    endif;

                    if( !isset( $teamList[ $identifier ] ) ) :
                        $teamList[ $identifier ] = new stdClass();
                        $teamList[ $identifier ]->identifier = $identifier;
                    endif;

                    switch( substr( $item, $dotPosition + 1 ) ) :
                        case 'png':
                            $teamList[ $identifier ]->hasImage = true;
                            break;
                        case 'cfg':
                            $teamList[ $identifier ]->hasConfig = true;
                            $file = fopen( $item, 'r' );
                            $teamList[ $identifier ]->name = fread( $file, filesize( $item ) );
                            fclose( $file );
                            break;
                        case 'zip':
                            $teamList[ $identifier ]->hasZip = true;
                            break;
                    endswitch;
                endforeach;
                foreach( $teamList as $team ) :
                    ?>
                    <tr>
                        <td>
                            <?php
                            if( $team->hasConfig ) :
                                echo $team->name;
                            else :
                                ?>
                                ???
                                <?php
                            endif;
                            ?>
                        </td>
                        <td>
                            <?php echo $team->identifier ?>
                        </td>
                        <td>
                            <?php
                            if( $team->hasImage ) :
                                ?>
                                <a href="<?php echo $team->identifier, '.png'; ?>">
                                    Download
                                </a>
                                <?php
                            endif;
                            ?>
                        </td>
                        <td>
                            <?php
                            if( $team->hasConfig ) :
                                ?>
                                <a href="<?php echo $team->identifier, '.cfg'; ?>">
                                    Download
                                </a>
                                <?php
                            endif;
                            ?>
                        </td>
                        <td>
                            <?php
                            if( $team->hasZip ) :
                                ?>
                                <a href="<?php echo $team->identifier, '.zip'; ?>">
                                    Download
                                </a>
                                <?php
                            endif;
                            ?>
                        </td>
                    </tr>
                    <?php
                endforeach;
                ?>
            </tbody>
        </table>
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
