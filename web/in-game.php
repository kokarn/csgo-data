<!DOCTYPE html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="utf8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>
        CSGO Team In-game logos
    </title>
    <link href="//cdn.jsdelivr.net/bootswatch/3.3.1.2/paper/bootstrap.min.css" rel="stylesheet">
    <style>
        table tbody > tr > td.vertical-middle {
            vertical-align: middle;
        }

        .modal-body img {
            max-width: 100%;
        }

        .location-code-wrapper:hover {
            cursor: pointer;
        }

        .container-fluid {
            max-width: 1170px;
        }
    </style>
</head>
<body>
    <div class="container-fluid">
        <h1>
            CSGO teams
        </h1>
        <p class="pull-left">
            Either put the files in
            <code data-toggle="modal" data-target="#location-modal" class="location-code-wrapper">
                csgo/resource/flash/econ/tournaments/teams/
            </code>
            <p class="pull-left">
                <a href="http://www.reddit.com/r/GlobalOffensive/comments/357q2u/a_simple_stepbystep_guide_to_include_any_team/">
                    or follow this simple guide on how to use these
                </a>
            </p>
            <div class="modal fade" id="location-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <img src="../resources/location.png">
                        </div>
                    </div>
                </div>
            </div>
        </p>
        <p class="pull-right">
            <a class="btn btn-primary" href="resources/fastdl.zip">
                FastDL Download
            </a>
            <a class="btn btn-primary" href="resources/all.zip">
                Download zip with all teams
            </a>
        </p>
        <table class="table table-hover">
            <tbody>
                <?php

                function nameSort( $a, $b ){
                    $lowercaseA = strtolower( $a->name );
                    $lowercaseB = strtolower( $b->name );

                    if( $lowercaseA > $lowercaseB ) :
                        return 1;
                    elseif( $lowercaseA < $lowercaseB ) :
                        return -1;
                    endif;

                    return 0;
                }

                $teamsPath = './resources/ingame/';
                $items = scandir( $teamsPath );
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
                            $file = fopen( $teamsPath . $item, 'r' );
                            $teamList[ $identifier ]->name = fread( $file, filesize( $teamsPath . $item ) );
                            fclose( $file );
                            break;
                        case 'zip':
                            $teamList[ $identifier ]->hasZip = true;
                            break;
                    endswitch;
                endforeach;

                usort( $teamList, 'nameSort' );

                foreach( $teamList as $team ) :
                    if( !isset( $team->hasImage ) || !$team->hasImage ) :
                        continue;
                    endif;
                    ?>
                    <tr>
                        <td class="vertical-middle">
                            <img src="<?php echo $teamsPath, $team->identifier, '.png'; ?>">
                        </td>
                        <td>
                            <p class="lead">
                                <?php
                                if( $team->hasConfig ) :
                                    echo $team->name;
                                else :
                                    ?>
                                    ???
                                    <?php
                                endif;
                                ?>
                            </p>
                            <em>
                                <?php echo $team->identifier ?>
                            </em>
                        </td>
                        <td class="text-right vertical-middle">
                            <?php
                            if( $team->hasImage ) :
                                ?>
                                <a class="btn btn-sm btn-primary" href="<?php echo $teamsPath, $team->identifier, '.png'; ?>">
                                    Download in-game logo
                                </a>
                                <?php
                            endif;
                            ?>
                        </td>
                        <td class="text-right vertical-middle">
                            <?php
                            if( $team->hasConfig ) :
                                ?>
                                <a class="btn btn-sm btn-primary" href="<?php echo $teamsPath, $team->identifier, '.cfg'; ?>">
                                    Download config
                                </a>
                                <?php
                            endif;
                            ?>
                        </td>
                        <td class="text-right vertical-middle">
                            <?php
                            if( $team->hasZip ) :
                                ?>
                                <a class="btn btn-sm btn-primary" href="<?php echo $teamsPath, $team->identifier, '.zip'; ?>">
                                    Download zip with logo and config
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
        <blockquote>
            <p>
                What is this? Logos for ants?
            </p>
            <small>
                <cite title="You">
                    You
                </cite>
            </small>
        </blockquote>
        <p class="lead">
            Yes, you want the high resolution logos, we get it.
            For performance and hotlinking reasons we don't have them hosted here.
            But you can easily get them from the <a href="https://github.com/kokarn/csgo-data/">GitHub repository</a>.
        </p>
    </div>
    <a href="https://github.com/kokarn/csgo-data">
        <img style="position: absolute; top: 0; right: 0; border: 0;" src="resources/contribute.png" alt="Contribute on GitHub">
    </a>
    <script src="//cdn.jsdelivr.net/g/jquery@2.1.3,bootstrap@3.3.1"></script>
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-3953312-24', 'auto');
        ga('send', 'pageview');
    </script>
</body>
