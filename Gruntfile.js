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
                    'web/ingame-logo/3dmax.png' : 'teams/3DMAX/logo-highres.png',
                    'web/ingame-logo/astanadragons.png' : 'teams/Astana Dragons/logo-highres.png',
                    'web/ingame-logo/bravadogaming.png' : 'teams/Bravado Gaming/logo-146x146.png',
                    'web/ingame-logo/clanmystik.png' : 'teams/Clan Mystik/logo-386x386.png',
                    'web/ingame-logo/cloud9.png' : 'teams/Cloud9/logo-300x300.png',
                    'web/ingame-logo/complexity.png' : 'teams/compLexity/logo-highres.png',
                    'web/ingame-logo/copenhagenwolves.png' : 'teams/Copenhagen Wolves/logo-highres.png',
                    'web/ingame-logo/counterlogicgaming.png' : 'teams/Counter Logic Gaming/logo-highres.png',
                    'web/ingame-logo/datteam.png' : 'teams/dAT Team/logo-257x257.png',
                    'web/ingame-logo/epsilonesports.png' : 'teams/Epsilon eSports/logo-highres.png',
                    'web/ingame-logo/escgaming.png' : 'teams/ESC Gaming/logo-highres.png',
                    'web/ingame-logo/flipsid3tactics.png' : 'teams/Flipsid3 Tactics/logo-highres.png',
                    'web/ingame-logo/fnatic.png' : 'teams/Fnatic/logo-highres.png',
                    'web/ingame-logo/gamers2.png' : 'teams/Gamers2/logo-highres.png',
                    'web/ingame-logo/hellraisers.png' : 'teams/HellRaisers/logo-highres.png',
                    'web/ingame-logo/ibuypower.png' : 'teams/iBUYPOWER/logo-highres.png',
                    'web/ingame-logo/inshock.png' : 'teams/INSHOCK/logo-highres.png',
                    'web/ingame-logo/kabumtd.png' : 'teams/KaBuM.TD/logo-highres.png',
                    'web/ingame-logo/lgbesports.png' : 'teams/LGB Esports/logo-highres.png',
                    'web/ingame-logo/londonconspiracy.png' : 'teams/London Conspiracy/logo-183x183.png',
                    'web/ingame-logo/mousesports.png' : 'teams/mousesports/logo-highres.png',
                    'web/ingame-logo/myxmg.png' : 'teams/MyXMG/logo-330x330.png',
                    'web/ingame-logo/natusvincere.png' : 'teams/Natus Vincere/logo-highres.png',
                    'web/ingame-logo/ninjasinpyjamas.png' : 'teams/Ninjas in Pyjamas/logo-highres.png',
                    'web/ingame-logo/pentasports.png' : 'teams/PENTA Sports/logo-highres.png',
                    'web/ingame-logo/piter.png' : 'teams/PiTER/logo-highres.png',
                    'web/ingame-logo/planetkeydynamics.png' : 'teams/Planetkey Dynamics/logo-394x394.png',
                    'web/ingame-logo/reasongaming.png' : 'teams/Reason Gaming/logo-397x397.png',
                    'web/ingame-logo/teamdignitas.png' : 'teams/Team Dignitas/logo-highres.png',
                    'web/ingame-logo/teamenvyus.png' : 'teams/Team EnVyUs/logo-highres.png',
                    'web/ingame-logo/teamldlccom.png' : 'teams/Team LDLC.com/logo-highres.png',
                    'web/ingame-logo/teamliquid.png' : 'teams/Team Liquid/logo-highres.png',
                    'web/ingame-logo/teamproperty.png' : 'teams/Team Property/logo-287x287.png',
                    'web/ingame-logo/teamsolomid.png' : 'teams/Team SoloMid/logo-highres.png',
                    'web/ingame-logo/teamwolf.png' : 'teams/Team Wolf/logo-184x184.png',
                    'web/ingame-logo/titan.png' : 'teams/Titan/logo-highres.png',
                    'web/ingame-logo/verygames.png' : 'teams/VeryGames/logo-highres.png',
                    'web/ingame-logo/virtuspro.png' : 'teams/Virtus.Pro/logo-highres.png',
                    'web/ingame-logo/voxeminor.png' : 'teams/Vox Eminor/logo-highres.png',
                    'web/ingame-logo/k1ck.png' : 'teams/K1CK/logo-171x171.png',
                    'web/ingame-logo/games4u.png' : 'teams/Games4u/logo-234x234.png',
                    'web/ingame-logo/mythic.png' : 'teams/Mythic/logo-272x272.png',
                    'web/ingame-logo/elevate.png' : 'teams/eLevate/logo-highres.png',
                    'web/ingame-logo/sapphirekelownadotcom.png' : 'teams/SapphireKelownaDotCom/logo-298x298.png',
                    'web/ingame-logo/immunity.png' : 'teams/Immunity/logo-208x208.png',
                    'web/ingame-logo/thechiefs.png' : 'teams/The Chiefs/logo-236x236.png',
                    'web/ingame-logo/streamline.png' : 'teams/Streamline/logo-highres.png',
                    'web/ingame-logo/avantgarde.png' : 'teams/Avant Garde/logo-292x292.png',
                    'web/ingame-logo/trident.png' : 'teams/TRIDENT/logo-221x221.png',
                    'web/ingame-logo/volgare.png' : 'teams/VOLGARE/logo-200x200.png',
                    'web/ingame-logo/x6tence.png' : 'teams/x6tence/logo-170x170.png',
                    'web/ingame-logo/wizards.png' : 'teams/Wizards/logo-188x188.png',
                    'web/ingame-logo/publiclirse.png' : 'teams/Publiclir.se/logo-161x161.png',
                    'web/ingame-logo/playingducks.png' : 'teams/Playing Ducks/logo-436x436.png',
                    'web/ingame-logo/onlinebots.png' : 'teams/OnlineBOTS/logo-265x265.png'
                }
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-responsive-images' );
    grunt.registerTask( 'default', [ 'responsive_images' ] );
};
