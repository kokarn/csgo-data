module.exports = function( grunt ) {
    grunt.initConfig({
        responsive_images: {
            options : {
                newFilesOnly: false,
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
                    'resources/ingame-logo/3dmax.png' : 'teams/3DMAX/logo-highres.png',
                    'resources/ingame-logo/astanadragons.png' : 'teams/Astana Dragons/logo-highres.png',
                    'resources/ingame-logo/bravadogaming.png' : 'teams/Bravado Gaming/logo-146x146.png',
                    'resources/ingame-logo/clanmystik.png' : 'teams/Clan Mystik/logo-386x386.png',
                    'resources/ingame-logo/cloud9.png' : 'teams/Cloud9/logo-300x300.png',
                    'resources/ingame-logo/complexity.png' : 'teams/compLexity/logo-highres.png',
                    'resources/ingame-logo/copenhagenwolves.png' : 'teams/Copenhagen Wolves/logo-highres.png',
                    'resources/ingame-logo/counterlogicgaming.png' : 'teams/Counter Logic Gaming/logo-highres.png',
                    'resources/ingame-logo/datteam.png' : 'teams/dAT Team/logo-184x184.png',
                    'resources/ingame-logo/epsilonesports.png' : 'teams/Epsilon eSports/logo-highres.png',
                    'resources/ingame-logo/escgaming.png' : 'teams/ESC Gaming/logo-highres.png',
                    'resources/ingame-logo/flipsid3tactics.png' : 'teams/Flipsid3 Tactics/logo-highres.png',
                    'resources/ingame-logo/fnatic.png' : 'teams/Fnatic/logo-highres.png',
                    'resources/ingame-logo/gamers2.png' : 'teams/Gamers2/logo-highres.png',
                    'resources/ingame-logo/hellraisers.png' : 'teams/HellRaisers/logo-highres.png',
                    'resources/ingame-logo/ibuypower.png' : 'teams/iBUYPOWER/logo-highres.png',
                    'resources/ingame-logo/inshock.png' : 'teams/INSHOCK/logo-highres.png',
                    'resources/ingame-logo/kabumtd.png' : 'teams/KaBuM.TD/logo-highres.png',
                    'resources/ingame-logo/lgbesports.png' : 'teams/LGB Esports/logo-highres.png',
                    'resources/ingame-logo/londonconspiracy.png' : 'teams/London Conspiracy/logo-183x183.png',
                    'resources/ingame-logo/mousesports.png' : 'teams/mousesports/logo-highres.png',
                    'resources/ingame-logo/myxmg.png' : 'teams/MyXMG/logo-330x330.png',
                    'resources/ingame-logo/natusvincere.png' : 'teams/Natus Vincere/logo-highres.png',
                    'resources/ingame-logo/ninjasinpyjamas.png' : 'teams/Ninjas in Pyjamas/logo-highres.png',
                    'resources/ingame-logo/pentasports.png' : 'teams/PENTA Sports/logo-highres.png',
                    'resources/ingame-logo/piter.png' : 'teams/PiTER/logo-highres.png',
                    'resources/ingame-logo/planetkeydynamics.png' : 'teams/PlanetKey Dynamics/logo-394x394.png',
                    'resources/ingame-logo/reasongaming.png' : 'teams/Reason Gaming/logo-397x397.png',
                    'resources/ingame-logo/teamdignitas.png' : 'teams/Team Dignitas/logo-highres.png',
                    'resources/ingame-logo/teamenvyus.png' : 'teams/Team EnVyUs/logo-highres.png',
                    'resources/ingame-logo/teamldlccom.png' : 'teams/Team LDLC.com/logo-highres.png',
                    'resources/ingame-logo/teamliquid.png' : 'teams/Team Liquid/logo-highres.png',
                    'resources/ingame-logo/teamproperty.png' : 'teams/Team Property/logo-287x287.png',
                    'resources/ingame-logo/teamsolomid.png' : 'teams/Team SoloMid/logo-highres.png',
                    'resources/ingame-logo/teamwolf.png' : 'teams/Team Wolf/logo-184x184.png',
                    'resources/ingame-logo/titan.png' : 'teams/Titan/logo-highres.png',
                    'resources/ingame-logo/verygames.png' : 'teams/VeryGames/logo-highres.png',
                    'resources/ingame-logo/virtuspro.png' : 'teams/Virtus.Pro/logo-highres.png',
                    'resources/ingame-logo/voxeminor.png' : 'teams/Vox Eminor/logo-highres.png',
                    'resources/ingame-logo/k1ck.png' : 'teams/K1CK/logo-171x171.png'
                }
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-responsive-images' );
    grunt.registerTask( 'default', [ 'responsive_images' ] );
};
