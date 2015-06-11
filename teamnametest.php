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
                        Mock value
                    </th>
                    <th>
                        Match
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
                    ),
                    array(
                        'status' => '(RU)NAVI vs VEGA by MCS|Oldkinder',
                        'teams' => array(
                            'natusvincere',
                            'vegasquadron'
                        )
                    ),
                    // This shouldn't be matched at all
                    array(
                        'status' => 'ESWC Khabarovsk',
                        'teams' => false
                    ),
                    array(
                        'status' => '[FR] ESL ESEA Pro League / 20:45 NiP vs. f3 / 21:45 NiP vs. f3 / 22:45 Dignitas vs. Na\'Vi',
                        'teams' => array(
                            'ninjasinpyjamas',
                            'flipsid3tactics'
                        )
                    ),
                    array(
                        'status' => 'F3ide vs. NiP on de_inferno @  ESL ESEA by Flife',
                        'teams' => array(
                            'ninjasinpyjamas',
                            'flipsid3tactics'
                        )
                    ),
                    array(
                        'status' => 'ESL ESEA Pro League - Method vs Tempo Storm',
                        'teams' => array(
                            'method',
                            'tempostorm'
                        )
                    ),
                    array(
                        'status' => '[RETRANSMISSÃO] Keyd vs. CLG --Próximo jogo: Keyd Stars vs. Team Liquid às 20:00 - ESL ESEA Pro League [NA]',
                        'teams' => array(
                            'keydstars',
                            'counterlogicgaming'
                        )
                    ),
                    array(
                        'status' => 'Virtus.PRO vs FlipSide on de_mirage @  ESL ESEA by ceh9',
                        'teams' => array(
                            'flipsid3tactics',
                            'virtuspro'
                        )
                    ),
                    array(
                        'status' => 'Fragbite Masters S4 LIVE : 19:00 Natus Vincerevs. vs Hellraisers #GIVEAWAY www.cmtv.eu',
                        'teams' => array(
                            'natusvincere',
                            'hellraisers'
                        )
                    ),
                    array(
                        'status' => 'CZ/SK DEV1S.com @ fragbite nEph vs. LGB o 22CET',
                        'teams' => array(
                            'neophyte',
                            'lgbesports'
                        )
                    ),
                    array(
                        'status' => 'Headshot.bg vs. Tricked - Balkan Championship #2 - Best of 3 Visit CSGOCasino.net 18+ only!',
                        'teams' => array(
                            'headshotbg',
                            'trickedesport'
                        )
                    ),
                    array(
                        'status' => 'Starladder 13 - Na\'Vi [0] vs [0] FlipSide (BO3)',
                        'teams' => array(
                            'natusvincere',
                            'flipsid3tactics'
                        )
                    ),
                    array(
                        'status' => 'Druidz vs Circadian in the ESL Majors!',
                        'teams' => array(
                            '-unknown-',
                            '-unknown-'
                        )
                    ),
                    array(
                        'status' => '[FR] TEAM LEGEND vs GamersLeague eSport 21h cevo',
                        'teams' => array(
                            '-unknown-',
                            '-unknown-'
                        )
                    ),
                    array(
                        'status' => 'TSM Kinguin vs Kinguin - Alienware Area51 CS:GO Cup 2 Finals',
                        'teams' => array(
                            'teamsolomid',
                            'teamkinguin'
                        )
                    ),
                    array(
                        'status' => 'CSGOcup.pl - FINAŁ Boys in Suits vs NEVER-LUCKY',
                        'teams' => array(
                            '-unknown-',
                            '-unknown-'
                        )
                    ),
                    array(
                        'status' => 'FACEIT 2015 League - EU Stage 2 - TSM.Kinguin vs Flipsid3 Tactics',
                        'teams' => array(
                            'teamsolomid',
                            'flipsid3tactics'
                        )
                    ),
                    array(
                        'status' => '[PT-BR] Nihilum vs. Cloud 9 - ESL ESEA Pro League (NA)',
                        'teams' => array(
                            'cloud9',
                            'nihilum'
                        )
                    ),
                    array(
                        'status' => 'GO:CL: VP vs dig w/ follower giveaways! [EN]',
                        'teams' => array(
                            'viruspro',
                            'teamdignitas'
                        )
                    )
                );

                $teamList = new AvailableTeams( 'web/' );

                $streamMock = new Stream();

                foreach( $mockDataList as $mockData ) :
                    if( $mockData[ 'teams' ] == false ) :
                        if( !$streamMock->isCast( $mockData[ 'status' ] ) ) :
                            $passed = true;
                        else :
                            $passed = false;
                        endif;
                    else:
                        $teams = $teamList->getTeamsInString( $mockData[ 'status' ] );
                        $teamIdentifiers = array( $teams[ 0 ][ 'identifier' ], $teams[ 1 ][ 'identifier' ] );
                        if( array_equal( $teamIdentifiers, $mockData[ 'teams' ] ) ) :
                            $passed = true;
                        else :
                            $passed = false;
                        endif;
                    endif;

                    ?>
                    <tr <?php
                    if( $passed ) :
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
                        <?php
                        if( $mockData[ 'teams' ] ) :
                            ?>
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
                            <?php
                        else:
                            ?>
                            <td>
                                Is not a cast
                            </td>
                            <td>
                                <?php
                                if( $passed ) :
                                    echo 'Is not a cast';
                                else :
                                    echo 'Is cast';
                                endif;
                                ?>
                            </td>
                            <?php
                        endif;
                        ?>
                    </tr>
                    <?php
                    //print_r( $teams );
                endforeach;
                ?>
            </tbody>
        </table>
    </div>
</body>
