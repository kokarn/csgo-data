module.exports = function(grunt) {

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
                    '3DMAX/3dmax.png' : '3DMAX/logo-highres.png',
                    'Astana Dragons/astanadragons.png' : 'Astana Dragons/logo-highres.png',
                    'Bravado Gaming/bravadogaming.png' : 'Bravado Gaming/logo-146x146.png',
                    'Clan Mystik/clanmystik.png' : 'Clan Mystik/logo-386x386.png',
                    'Cloud9/cloud9.png' : 'Cloud9/logo-highres.png',
                    'compLexity/complexity.png' : 'compLexity/logo-highres.png',
                    'Copenhagen Wolves/copenhagenwolves.png' : 'Copenhagen Wolves/logo-highres.png',
                    'Counter Logic Gaming/counterlogicgaming.png' : 'Counter Logic Gaming/logo-highres.png',
                    'dAT Team/datteam.png' : 'dAT Team/logo-184x184.png',
                    'Epsilon eSports/epsilonesports.png' : 'Epsilon eSports/logo-highres.png',
                    'ESC Gaming/escgaming.png' : 'ESC Gaming/logo-highres.png',
                    'Flipsid3 Tactics/flipsid3tactics.png' : 'Flipsid3 Tactics/logo-highres.png',
                    'Fnatic/fnatic.png' : 'Fnatic/logo-highres.png',
                    'Gamers2/gamers2.png' : 'Gamers2/logo-highres.png',
                    'HellRaisers/hellraisers.png' : 'HellRaisers/logo-highres.png',
                    'iBUYPOWER/ibuypower.png' : 'iBUYPOWER/logo-highres.png',
                    'INSHOCK/inshock.png' : 'INSHOCK/logo-highres.png',
                    'KaBuM.TD/kabumtd.png' : 'KaBuM.TD/logo-highres.png',
                    'LGB Esports/lgbesports.png' : 'LGB Esports/logo-highres.png',
                    'London Conspiracy/londonconspiracy.png' : 'London Conspiracy/logo-250x250.png',
                    'mousesports/mousesports.png' : 'mousesports/logo-highres.png',
                    'MyXMG/myxmg.png' : 'MyXMG/logo-358x265.png',
                    'Natus Vincere/natusvincere.png' : 'Natus Vincere/logo-highres.png',
                    'PENTA Sports/pentasports.png' : 'PENTA Sports/logo-highres.png',
                    'PiTER/piter.png' : 'PiTER/logo-highres.png',
                    'PlanetKey Dynamics/planetkeydynamics.png' : 'PlanetKey Dynamics/logo-highres.png',
                    'Reason Gaming/reasongaming.png' : 'Reason Gaming/logo-highres.png',
                    'Team Dignitas/teamdignitas.png' : 'Team Dignitas/logo-highres.png',
                    'Team EnVyUs/teamenvyus.png' : 'Team EnVyUs/logo-highres.png',
                    'Team LDLC.com/teamldlccom.png' : 'Team LDLC.com/logo-highres.png',
                    'Team Liquid/teamliquid.png' : 'Team Liquid/logo-highres.png',
                    'Team Property/teamproperty.png' : 'Team Property/logo-300x300.png',
                    'Team SoloMid/teamsolomid.png' : 'Team SoloMid/logo-highres.png',
                    'Team Wolf/teamwolf.png' : 'Team Wolf/logo-184x184.png',
                    'Titan/titan.png' : 'Titan/logo-highres.png',
                    'VeryGames/verygames.png' : 'VeryGames/logo-highres.png',
                    'Virtus.Pro/virtuspro.png' : 'Virtus.Pro/logo-highres.png',
                    'Vox Eminor/voxeminor.png' : 'Vox Eminor/logo-highres.png',
                    'K1CK/k1ck.png' : 'K1CK/logo-174x157.png'
                }
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-responsive-images' );
    grunt.registerTask( 'default', [ 'responsive_images' ] );
};
