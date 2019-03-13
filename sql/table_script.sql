DROP 
  TABLE IF EXISTS "tbl_type";
CREATE TABLE "tbl_type"(
  "type_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  "type_name" TEXT
);
DROP 
  TABLE IF EXISTS "tbl_domain";
CREATE TABLE "tbl_domain" (
  "domain_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  "domain_name" TEXT
);
DROP 
  TABLE IF EXISTS "tbl_run_datetime";
CREATE TABLE "tbl_run_datetime" (
  "run_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  "run_datetime" INT
);
DROP 
  TABLE IF EXISTS "tbl_record";
CREATE TABLE "tbl_record" (
  "record_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  "run_id" INTEGER, 
  "record_timestamp" TEXT, 
  "domain_id" INT, 
  "record_values" TEXT,
  FOREIGN KEY ("run_id") REFERENCES "tbl_run_datetime" ("run_id"), 
  FOREIGN KEY ("domain_id") REFERENCES "tbl_domain" ("domain_id")
);
INSERT INTO "tbl_domain" 
VALUES 
  (1, '382reporting.ost.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (2, '3pdp.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (3, '911-test.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (4, '911.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (5, 'ac-1.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (6, 'ac-2.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (7, 'ac.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (8, 'ac1.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (9, 'ac2.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (10, 'academy.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (11, 'acbackup.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (12, 'adfs.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (13, 'ai.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (14, 'airconsumer.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (15, 'aitraining.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (16, 'ama310s1.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (17, 'ama310s7.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (18, 'ame.cami.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (19, 'animalreport.ost.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (20, 'aosftp.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (21, 'api.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    22, 'app.seavision.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    23, 'app.stag.seavision.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (24, 'apps.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (25, 'arc-mcac-a312.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (26, 'arc-mcac-vw117.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (27, 'arc-mcac-vw172.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (28, 'ask.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (29, 'atcreform.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (30, 'balancer1.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (31, 'bip.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (32, 'bomgar.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    33, 'borderplanning.fhwa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (34, 'bts.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (35, 'c3rs.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (36, 'ccdp.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    37, 'cdan-prod-balancer.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (38, 'cdan.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (39, 'cdan.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    40, 'chat.seavision.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    41, 'chat.seavision2-integ.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    42, 'chat.stag.seavision.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (43, 'checkthebox.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (44, 'civilrights.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (45, 'closecall.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (46, 'cms.bts.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (47, 'cms.data.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (48, 'cms.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (49, 'cms.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (50, 'cms.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (51, 'cms.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (52, 'cms.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (53, 'cms.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (54, 'cms.seaway.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (55, 'cms.secure.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    56, 'collaboration.fhwa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (57, 'corridors.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (58, 'crashstats.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (59, 'crashviewer.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (60, 'crd.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (61, 'csa.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (62, 'csatraining.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (63, 'cvisn.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (64, 'damis.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (65, 'data.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (66, 'data.transportation.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (67, 'dataqs.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (68, 'demo.eebacs.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (69, 'dev.explore.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (70, 'dialin.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (71, 'distracteddriving.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (72, 'distraction.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (73, 'dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (74, 'dotcms.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    75, 'dotdmzadf001vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    76, 'dotdmzadf002vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    77, 'dotdmzadf022vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    78, 'dotdmzadf023vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    79, 'dotdmzasr001vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    80, 'dotdmzsus001vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    81, 'dotdmzwas005vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (82, 'dotdmzwas018vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    83, 'dotdmzwas018vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (84, 'dotdmzwas019vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    85, 'dotdmzwas019vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    86, 'dotdmzwws001vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (87, 'dotdr1vdi015vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (88, 'dotdr1vdi016vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (89, 'dotdr1vdi017vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (90, 'dothqevdi015vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (91, 'dothqevdi016vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (92, 'dothqevdi017vg.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (93, 'dothqnbom001.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (94, 'dothqnbom002.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    95, 'dothqnwas053vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (96, 'dotnet.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (97, 'dp.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (98, 'drc.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (99, 'eauth1.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (100, 'edtservice.cdan.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (101, 'eebacs.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (102, 'einvoice.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (103, 'eld.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (104, 'elmscontent.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (105, 'elmsstaging.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (106, 'email.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (107, 'emfie.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (108, 'ems.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (109, 'enepa.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (110, 'engage.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (111, 'environment.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (112, 'epr.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (113, 'es3.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (114, 'esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (115, 'escapps.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    116, 'escsupportservice.esc.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (117, 'esubmit.rita.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (118, 'explore.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (119, 'ezexam.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (120, 'f5ltmvpn-dmz-vip.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (121, 'faasafety.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (122, 'faces.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (123, 'facesdev1.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (124, 'facesdev2.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (125, 'facesdev3.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (126, 'facesdev4.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (127, 'facesdev5.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (128, 'facespreprod.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (129, 'facestest1.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (130, 'facestest2.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (131, 'facestest3.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (132, 'facestest4.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (133, 'facestest5.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    134, 'facestraining.fta.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (135, 'facesuat.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (136, 'fedstar.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (137, 'fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (138, 'fhwaapps.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (139, 'fhwaappssp.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (140, 'fhwaopsweb.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    141, 'filingtarmacdelayplan.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    142, 'financecommission.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (143, 'flh.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (144, 'fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (145, 'fmcsa.portal.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (146, 'forms.cdan.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (147, 'fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (148, 'fragis.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    149, 'frahqelpx002ex.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (150, 'fraipv6.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (151, 'frasp.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (152, 'freight.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (153, 'fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (154, 'ftaecho.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (155, 'ftaecho2.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (156, 'ftawebapps.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (157, 'ftawebprod.fta.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (158, 'ftp.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (159, 'geo.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (160, 'gis.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (161, 'gradedec.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (162, 'grants.ost.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (163, 'groups.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (164, 'gts.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (165, 'gtstest.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (166, 'hazmat.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    167, 'hazmatgrants.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    168, 'hazmatonline.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    169, 'hazmatonlinedevtest.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (170, 'hazmatsafety.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (171, 'hepgis.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (172, 'hfcc.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (173, 'highways.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (174, 'highways.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (175, 'hip.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (176, 'hiptest.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    177, 'hostedsites.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (178, 'hovpfs.ops.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    179, 'ia-content-stage.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    180, 'ia-training-stage.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (181, 'icsodiw.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (182, 'idpwebsealp.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    183, 'info.seavision.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (184, 'infobridge.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (185, 'infopave.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (186, 'infosys.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    187, 'international.fhwa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (188, 'its.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (189, 'jag.cami.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (190, 'keymaster.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (191, 'learn.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (192, 'legacy-dredata.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (193, 'li-public.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (194, 'mailsync.oig.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (195, 'map.safercar.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (196, 'maps.bts.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (197, 'maps.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (198, 'marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    199, 'maradpublicsp.marad.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (200, 'marapps.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (201, 'maritime.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (202, 'marweb.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (203, 'mcmis.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (204, 'mcp.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (205, 'mcs.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (206, 'mcsac.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (207, 'mda.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (208, 'meet.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (209, 'mobile.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (210, 'mos.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (211, 'mp.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (212, 'mrb.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (213, 'mscs.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (214, 'mssis.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (215, 'mutcd.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (216, 'mydomain');
INSERT INTO "tbl_domain" 
VALUES 
  (
    217, 'nationalregistry.fmcsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (218, 'nccdb.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (219, 'near-miss.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (220, 'nhi.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    221, 'nhthqnwas701.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    222, 'nhthqnwas733.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    223, 'nhthqnwas767.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    224, 'nhthqnwas768.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    225, 'nhthsaf5b-m.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (226, 'nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (227, 'nprn.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    228, 'ntcscheduler.fmcsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (229, 'ntl.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (230, 'ntlsearch.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (231, 'oetcrt.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (232, 'oig.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (233, 'oigmobile.oig.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (234, 'one.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (235, 'ops.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (236, 'opsweb.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (237, 'origin-dr-gts.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    238, 'origin-www-odi.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (239, 'origin-www.faasafety.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (240, 'origin-www.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (241, 'osdbu.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (242, 'osthqnwas093.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    243, 'ostrazedwws001.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    244, 'ostrazewws001vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    245, 'ostrazewws002vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (246, 'oversight.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (247, 'parkingapp.ost.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (248, 'pdm.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    249, 'phmhqnwas004.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    250, 'phmhqnwas024.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    251, 'phmhqnwas036.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    252, 'phmhqnwas070vg.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    253, 'phmhqnwas071.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    254, 'phmhqnwas071vg.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    255, 'phmhqnwas072vg.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    256, 'phmhqnwas080vg.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    257, 'phmhqnwas102vg.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (258, 'phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    259, 'phmsamobile.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (260, 'pipelinesafety.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    261, 'plan4operations.fhwa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (262, 'planning.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (263, 'pnt.rita.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (264, 'poolsfc.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (265, 'portal.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (266, 'portal.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (267, 'portal.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (268, 'preprod.faasafety.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    269, 'primis-stage.phmsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (270, 'primis.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (271, 'protectyourmove.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (272, 'prs.ost.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (273, 'pvnpms.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (274, 'railroads.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (275, 'railroads.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (276, 'rcapm.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (277, 'remote.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (278, 'remote2.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (279, 'remotef.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (280, 'reports.cdan.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (281, 'resourcecenter.911.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (282, 'rita.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    283, 'rithqnwws008vg.ext.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (284, 'rms.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (285, 'rosap.ntl.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (286, 'rrsp.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (287, 'rsac.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    288, 'rspcb.safety.fhwa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (289, 'safecar.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (290, 'safedigging.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (291, 'safeocs.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (292, 'safer.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (293, 'safercar.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (294, 'safertruck.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (295, 'safety.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (296, 'safetydata.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (297, 'safetytalk.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (298, 'sai.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    299, 'sas-prod-oa-balancer.nhtsa.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (300, 'score.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (301, 'seavision.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (302, 'seaway.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (303, 'secure.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (304, 'sfm.fmcsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (305, 'sftp.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (306, 'sftp.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (307, 'sharetheroadsafely.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (308, 'sir.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (309, 'skynet.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (310, 'slfts.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (311, 'smarterskies.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (312, 'sra.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    313, 'stag.seavision.volpe.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (314, 'stage-cidrs.cdan.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (315, 'stage.fra.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (316, 'staging.learn.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (317, 'standards.its.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (318, 'staqsdevext.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (319, 'staqspostprodext.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (320, 'staqsprodext.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (321, 'staqstestext.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (322, 'staqstrainext.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (323, 'statemetrics.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (324, 'static.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (325, 'stb.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (326, 'stbremote.esc.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (327, 'stg-api.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (328, 'strap.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (329, 'strongports.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (330, 'survey.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (331, 'swim.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (332, 'tankcar.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (333, 'tdwr.jccbi.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (334, 'tmcpfs.ops.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (335, 'tmip.fhwa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    336, 'trafficsafetymarketing.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    337, 'training-cidrs.cdan.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (
    338, 'training-parse.cdan.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (339, 'transborder.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (340, 'transerve.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    341, 'transit-safety.fta.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (342, 'transit.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (343, 'transitapp.ost.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    344, 'transitapptraining.ost.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (345, 'transtats.bts.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (346, 'triprs.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (347, 'tsi.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (348, 'tsp.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (349, 'upa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (350, 'usmma.edu');
INSERT INTO "tbl_domain" 
VALUES 
  (351, 'utc.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (352, 'vbulletin.phmsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (353, 'vdi-dr.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (354, 'vdi.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (355, 'vinrcl.safercar.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (356, 'voa.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (357, 'volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (358, 'volpedb1.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (359, 'volpevtc.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (360, 'vpic.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (361, 'vpiclist.cdan.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (362, 'vpicpubportal.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (363, 'vrs.volpe.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (364, 'webapi.nhtsa.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (365, 'webapps.marad.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (366, 'webeoc.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (
    367, 'websiteaccessibility.dot.gov'
  );
INSERT INTO "tbl_domain" 
VALUES 
  (368, 'www-esv.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (369, 'www-fars.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (370, 'www-nrd.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (371, 'www-odi.nhtsa.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (372, 'www.tsi.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (373, 'www1.oig.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (374, 'www2.oig.dot.gov');
INSERT INTO "tbl_domain" 
VALUES 
  (375, 'wxde.fhwa.dot.gov');
INSERT INTO "tbl_type" 
VALUES 
  (1, 'A');
INSERT INTO "tbl_type" 
VALUES 
  (2, 'AAAA');
INSERT INTO "tbl_type" 
VALUES 
  (3, 'CNAME');
INSERT INTO "tbl_type" 
VALUES 
  (4, 'MX');
INSERT INTO "tbl_type" 
VALUES 
  (5, 'NS');
INSERT INTO "tbl_type" 
VALUES 
  (6, 'SOA');
