<?php
include( 'web/includes/default.php' );
function array_equal( $a, $b ) {
    return (is_array($a) && is_array($b) && array_diff($a, $b) === array_diff($b, $a));
}
?>
<!DOCTYPE html>
<head>
    <title>
        Team name test
    </title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="stylesheet" href="//cdn.jsdelivr.net/bootswatch/3.3.2/paper/bootstrap.min.css">
</head>
<body>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>
                        Status
                    </th>
                    <th>
                        Correct teams
                    </th>
                    <th>
                        Found teams
                    </th>
                </tr>
            </thead>
            <tbody>
                <?php
                $mockDataList = array(
                    array(
                        'status' => 'Acer Team Championship Kinguin VS dignitas',
                        'teams' => array(
                            'teamkinguin',
                            'teamdignitas'
                        )
                    ),
                    array(
                        'status' => 'FACEIT.com - Starladder XIII - EnVyUs vs Gamers2 0 - 0 (BO3)',
                        'teams' => array(
                            'teamenvyus',
                            'gamers2'
                        )
                    ),
                    array(
                        'status' => 'FACEIT.com - Starladder XIII - Team Kinguin vs ex-Copenhagen Wolves (BO3)',
                        'teams' => array(
                            'teamkinguin',
                            'copenhagenwolves'
                        )
                    ),
                    array(
                        'status' => 'FACEIT.com - FACEIT 2015 League Stage 1 - Day 3 - Grand Final - Ninjas in Pyjamas vs TSM.Kinguin (BO3)',
                        'teams' => array(
                            'ninjasinpyjamas',
                            'teamsolomid'
                        )
                    ),
                    array(
                        'status' => 'Fightdat leageu - gamers2 vs TSM.Kinguin',
                        'teams' => array(
                            'gamers2',
                            'teamsolomid'
                        )
                    ),
                    array(
                        'status' => 'Ora 22:00 Kinguin vs. undefined [SLTV StarSeries XIII]',
                        'teams' => array(
                            'teamkinguin',
                            '-unknown-'
                        )
                    ),
                    array(
                        'status' => 'EnVyUs vs. Gamers2 || StarSeries S13 || @sL4Mtv @sltvstrike',
                        'teams' => array(
                            'teamenvyus',
                            'gamers2'
                        )
                    ),
                    array(
                        'status' => 'КУБОК МУРА, HR vs M5 by Tafa & Strike',
                        'teams' => array(
                            'hellraisers',
                            'moscowfive'
                        )
                    ),
                    array(
                        'status' => 'Team Kinguin vs. Undefined || StarSeries S13 Group D || @sL4Mtv',
                        'teams' => array(
                            'teamkinguin',
                            '-unknown-'
                        )
                    ),
                    array(
                        'status' => 'Na`Vi vs. NiP || Gfinity Spring Masters 2 || by Kvan & Strike',
                        'teams' => array(
                            'natusvincere',
                            'ninjasinpyjamas'
                        )
                    ),
                    array(
                        'status' => 'Liquid vs. VOX || Gfinity Spring Masters 2 || @sL4Mtv @sltvstrike',
                        'teams' => array(
                            'teamliquid',
                            'voxeminor'
                        )
                    ),
                    array(
                        'status' => 'NiP vs. Liquid || Gfinity Spring Masters 2 || @sL4Mtv @sltvstrike',
                        'teams' => array(
                            'ninjasinpyjamas',
                            'teamliquid'
                        )
                    ),
                    array(
                        'status' => 'nerdRage vs. AlienTech.black || FBM S4 || @sL4Mtv @sltvstrike',
                        'teams' => array(
                            '-unknown-',
                            'teamalientech'
                        )
                    ),
                    array(
                        'status' => '[FR] - CounterPit - Team Dignitas vs Virtus Pro',
                        'teams' => array(
                            'teamdignitas',
                            'virtuspro'
                        )
                    )
                    ,
                    array(
                        'status' => 'Patrick матч FlipSid3 vs. LDLC White',
                        'teams' => array(
                            'flipsid3tactics',
                            'teamldlccom'
                        )
                    )
                    ,
                    array(
                        'status' => 'FlipSid3 vs. LDLC.White | StarSeries S13 | sL4M',
                        'teams' => array(
                            'flipsid3tactics',
                            'teamldlccom'
                        )
                    )
                    ,
                    array(
                        'status' => '[ESL /w KeitaTV] (Starts 21.30) LGB eSports vs. KillerFish (Acer Predator Master)',
                        'teams' => array(
                            'lgbesports',
                            'killerfishesport'
                        )
                    )
                    ,
                    array(
                        'status' => 'LGB vs KillerFish @ Acer Predator Masters powered by Intel',
                        'teams' => array(
                            'lgbesports',
                            'killerfishesport'
                        )
                    )
                    ,
                    array(
                        'status' => 'ESL Spain: LGB eSports vs KillerFish - TakeTV Acer Predator Master',
                        'teams' => array(
                            'lgbesports',
                            'killerfishesport'
                        )
                    ),
                    array(
                        'status' => 'Acer Predator Masters LIVE 21:30 LGB vs. KILLERFISH www.cmtv.eu #Giveaway‬',
                        'teams' => array(
                            'lgbesports',
                            'killerfishesport'
                        )
                    ),
                    array(
                        'status' => 'Kibicujemy Polakom G2 vs Virtus',
                        'teams' => array(
                            'gamers2',
                            'virtuspro'
                        )
                    )
                );

                $teamList = new AvailableTeams( 'web/' );

                foreach( $mockDataList as $mockData ) :
                    $teams = $teamList->getTeamsInString( $mockData[ 'status' ] );
                    $teamIdentifiers = array( $teams[ 0 ][ 'identifier' ], $teams[ 1 ][ 'identifier' ] );
                    ?>
                    <tr <?php
                    if( array_equal( $teamIdentifiers, $mockData[ 'teams' ] ) ) :
                        echo 'class="success"';
                    else :
                        echo 'class="danger"';
                    endif;
                    ?>>
                        <td>
                            <?php
                            echo $mockData[ 'status' ];
                            ?>
                        </td>
                        <td>
                            <?php
                            echo implode( ' vs ', $mockData[ 'teams' ] );
                            ?>
                        </td>
                        <td>
                            <?php
                            echo $teams[ 0 ][ 'identifier' ], ' vs ', $teams[ 1 ][ 'identifier' ];
                            ?>
                        </td>
                    </tr>
                    <?php
                    //print_r( $teams );
                endforeach;
                ?>
            </tbody>
        </table>
    </div>
</body>
