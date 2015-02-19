module.exports = function( grunt ) {
    grunt.initConfig({
        responsive_images: {
            options : {
                //newFilesOnly: false,
                sizes : [{
                    name : "ingame",
                    height : 64,
                    width: 64,
                    rename: false,
                    aspectRatio: false
                }]
            },
            default : {
                files : {
                    'web/teams/3dmax.png' : 'teams/3DMAX/logo-highres.png',
                    'web/teams/astanadragons.png' : 'teams/Astana Dragons/logo-highres.png',
                    'web/teams/bravadogaming.png' : 'teams/Bravado Gaming/logo-146x146.png',
                    'web/teams/clanmystik.png' : 'teams/Clan Mystik/logo-highres.png',
                    'web/teams/cloud9.png' : 'teams/Cloud9/logo-highres.png',
                    'web/teams/complexity.png' : 'teams/compLexity/logo-highres.png',
                    'web/teams/copenhagenwolves.png' : 'teams/Copenhagen Wolves/logo-highres.png',
                    'web/teams/counterlogicgaming.png' : 'teams/Counter Logic Gaming/logo-highres.png',
                    'web/teams/datteam.png' : 'teams/dAT Team/logo-257x257.png',
                    'web/teams/epsilonesports.png' : 'teams/Epsilon eSports/logo-highres.png',
                    'web/teams/escgaming.png' : 'teams/ESC Gaming/logo-highres.png',
                    'web/teams/flipsid3tactics.png' : 'teams/Flipsid3 Tactics/logo-highres.png',
                    'web/teams/fnatic.png' : 'teams/Fnatic/logo-highres.png',
                    'web/teams/gamers2.png' : 'teams/Gamers2/logo-highres.png',
                    'web/teams/hellraisers.png' : 'teams/HellRaisers/logo-highres.png',
                    'web/teams/ibuypower.png' : 'teams/iBUYPOWER/logo-highres.png',
                    'web/teams/inshock.png' : 'teams/INSHOCK/logo-highres.png',
                    'web/teams/kabumtd.png' : 'teams/KaBuM.TD/logo-highres.png',
                    'web/teams/lgbesports.png' : 'teams/LGB Esports/logo-highres.png',
                    'web/teams/londonconspiracy.png' : 'teams/London Conspiracy/logo-183x183.png',
                    'web/teams/mousesports.png' : 'teams/mousesports/logo-highres.png',
                    'web/teams/myxmg.png' : 'teams/MyXMG/logo-highres.png',
                    'web/teams/natusvincere.png' : 'teams/Natus Vincere/logo-highres.png',
                    'web/teams/ninjasinpyjamas.png' : 'teams/Ninjas in Pyjamas/logo-highres.png',
                    'web/teams/pentasports.png' : 'teams/PENTA Sports/logo-highres.png',
                    'web/teams/piter.png' : 'teams/PiTER/logo-highres.png',
                    'web/teams/planetkeydynamics.png' : 'teams/Planetkey Dynamics/logo-394x394.png',
                    'web/teams/reasongaming.png' : 'teams/Reason Gaming/logo-397x397.png',
                    'web/teams/teamdignitas.png' : 'teams/Team Dignitas/logo-highres.png',
                    'web/teams/teamenvyus.png' : 'teams/Team EnVyUs/logo-highres.png',
                    'web/teams/teamldlccom.png' : 'teams/Team LDLC.com/logo-highres.png',
                    'web/teams/teamliquid.png' : 'teams/Team Liquid/logo-highres.png',
                    'web/teams/teamproperty.png' : 'teams/Team Property/logo-287x287.png',
                    'web/teams/teamsolomid.png' : 'teams/Team SoloMid/logo-highres.png',
                    'web/teams/teamwolf.png' : 'teams/Team Wolf/logo-184x184.png',
                    'web/teams/titan.png' : 'teams/Titan/logo-highres.png',
                    'web/teams/verygames.png' : 'teams/VeryGames/logo-highres.png',
                    'web/teams/virtuspro.png' : 'teams/Virtus.Pro/logo-highres.png',
                    'web/teams/voxeminor.png' : 'teams/Vox Eminor/logo-highres.png',
                    'web/teams/k1ck.png' : 'teams/K1CK/logo-171x171.png',
                    'web/teams/games4u.png' : 'teams/Games4u/logo-234x234.png',
                    'web/teams/mythic.png' : 'teams/Mythic/logo-272x272.png',
                    'web/teams/elevate.png' : 'teams/eLevate/logo-highres.png',
                    'web/teams/sapphirekelownadotcom.png' : 'teams/SapphireKelownaDotCom/logo-298x298.png',
                    'web/teams/immunity.png' : 'teams/Immunity/logo-208x208.png',
                    'web/teams/thechiefs.png' : 'teams/The Chiefs/logo-236x236.png',
                    'web/teams/streamline.png' : 'teams/Streamline/logo-highres.png',
                    'web/teams/avantgarde.png' : 'teams/Avant Garde/logo-292x292.png',
                    'web/teams/trident.png' : 'teams/TRIDENT/logo-221x221.png',
                    'web/teams/volgare.png' : 'teams/VOLGARE/logo-200x200.png',
                    'web/teams/x6tence.png' : 'teams/x6tence/logo-170x170.png',
                    'web/teams/wizards.png' : 'teams/Wizards/logo-188x188.png',
                    'web/teams/publiclirse.png' : 'teams/Publiclir.se/logo-161x161.png',
                    'web/teams/playingducks.png' : 'teams/Playing Ducks/logo-436x436.png',
                    'web/teams/onlinebots.png' : 'teams/OnlineBOTS/logo-265x265.png',
                    'web/teams/badmonkeygaming.png' : 'teams/Bad Monkey Gaming/logo-highres.png',
                    'web/teams/affnity.png' : 'teams/affNity/logo-271x271.png',
                    'web/teams/ascendancy.png' : 'teams/Ascendancy/logo-187x187.png',
                    'web/teams/denialesports.png' : 'teams/Denial eSports/logo-231x231.png',
                    'web/teams/lunatikesports.png' : 'teams/LunatiK eSports/logo-highres.png',
                    'web/teams/gplay.png' : 'teams/GPlay/logo-355x355.png'
                }
            }
        },
        imagemin: {
            source: {
                options: {
                    optimizationLevel: 4
                },
                files: [{
                    expand: true,
                    cwd: 'teams/',
                    src: ['**/*.png'],
                    dest: 'teams/'
                }]
            },
            ingame: {
                options: {
                    optimizationLevel: 4
                },
                files: [{
                    expand: true,
                    cwd: 'web/teams/',
                    src: ['*.png'],
                    dest: 'web/teams/'
                }]
            }
        }
    });

    grunt.loadTasks( 'tasks' );

    grunt.loadNpmTasks( 'grunt-newer' );
    grunt.loadNpmTasks( 'grunt-contrib-imagemin' );
    grunt.loadNpmTasks( 'grunt-responsive-images' );

    grunt.registerTask( 'teamdata', [ 'teams', 'teams_zip' ] );
    grunt.registerTask( 'default', [ 'newer:imagemin:source', 'responsive_images', 'newer:imagemin:ingame', 'teamdata' ] );
};
