

define(['model/sun/SolarCalculator', 'tests/sun/SolarData', 'tests/sun/SolarPositionAlgorithm', 'QUnit'],
        function (SolarCalculator, SolarData, spa, QUnit) {
            "use strict";
            var run = function () {
                var nearlyEquals = function (a, b, epsilon) {
                    return Math.abs(a - b) <= Math.abs(epsilon);
                };
                // reference date for test
                var refDate = new Date(2003, 9, 17, 12, 30, 30);
                // reference position for test
                var observer = {latitude: 39.742476, longitude: -105.1786, elevation: 1830.14};
                var terrain = {aspect: -10, slope: 30};
                var refData = new SolarData(refDate, -7, observer, terrain, 11, 820);

                spa.calculate(refData);

                test("getJD", function (assert) {// Passing in the QUnit.assert namespace

                    var calc = new SolarCalculator();

                    var julianDates = [
                        {yr: 1987, mo: 1, dy: 27, jd: 2446822.5},
                        {yr: 1988, mo: 1, dy: 27, jd: 2447187.5},
                        {yr: 1999, mo: 1, dy: 1, jd: 2451179.5},
                        {yr: 2003, mo: 10, dy: 17, jd: 2452929.5}],
                            i, max, date, jd;

                    for (i = 0, max = julianDates.length; i < max; i++) {
                        date = julianDates[i];
                        jd = calc.getJD(date.yr, date.mo, date.dy);
                        assert.ok(nearlyEquals(date.jd, jd, 0.0), date.yr + '/' + date.mo + '/' + date.dy + " : " + date.jd + " ~= " + jd);
                    }
                });
                /**
                 * 
                 * @param {type} assert
                 * @returns {undefined}
                 */
                test("validate", function (assert) {

                    // Create the instance to be tested
                    var calc = new SolarCalculator();
                    for (var i = 0; i <= 365; i++) {
                        var testDate = new Date();
                        testDate.setTime(refDate.getTime() + i * 86400000);
                        var testData = new SolarData(testDate, -7, observer, terrain, 11, 820);

                        // Generate expected test results 
                        spa.calculate(testData);

                        // Define the expected results
                        var expected = {
                            julianDate: testData.jd,
                            azimuth: spa.limit_degrees180pm(testData.azimuth),
                            zenith: testData.zenith,
                            hourAngle: spa.limit_degrees180pm(testData.h),
                            subsolarLatitude: testData.delta_prime,
                            subsolarLongitude: spa.limit_degrees180pm(observer.longitude - testData.h_prime),
                        };

                        // Generate the test results
                        var result = calc.calculate(testDate, -7, observer.latitude, observer.longitude);

                        // Validate the results
                        assert.ok(result !== undefined, "result is not 'undefined'");
                        assert.ok(nearlyEquals(result.julianDate, expected.julianDate, 0.0001), 'julianDate: ' + result.julianDate + " ~= " + expected.julianDate);
                        assert.ok(nearlyEquals(result.azimuth, expected.azimuth, 0.05), 'azimuth: ' + result.azimuth + " ~= " + expected.azimuth);
                        assert.ok(nearlyEquals(result.zenith, expected.zenith, 0.05), 'zenith: ' + result.zenith + " ~= " + expected.zenith);
                        assert.ok(nearlyEquals(result.hourAngle, expected.hourAngle, 0.02), 'hourAngle: ' + result.hourAngle + " ~= " + expected.hourAngle);
                        assert.ok(nearlyEquals(result.subsolarLatitude, expected.subsolarLatitude, 0.01), 'subsolarLatitude: ' + result.subsolarLatitude + " ~= " + expected.subsolarLatitude);
                        assert.ok(nearlyEquals(result.subsolarLongitude, expected.subsolarLongitude, 0.02), 'subsolarLongitude: ' + result.subsolarLongitude + " ~= " + expected.subsolarLongitude);
                    }
                });
                test("calculate", function (assert) {

                    // Create the instance to be tested
                    var calc = new SolarCalculator();

                    // Define the expected results
                    var expected = {
                        julianDate: refData.jd,
                        azimuth: spa.limit_degrees180pm(refData.azimuth),
                        zenith: refData.zenith,
                        hourAngle: refData.h,
                        subsolarLatitude: refData.delta_prime,
                        subsolarLongitude: observer.longitude - refData.h_prime,
                        rightAscension: refData.alpha,
                    };

                    // Generate the test results
                    var result = calc.calculate(refDate, -7, observer.latitude, observer.longitude);

                    // Validate the results
                    assert.ok(result !== undefined, "result is not 'undefined'");
                    assert.ok(nearlyEquals(result.julianDate, expected.julianDate, 0.0001), 'julianDate: ' + result.julianDate + " ~= " + expected.julianDate);
                    assert.ok(nearlyEquals(result.azimuth, expected.azimuth, 0.01), 'azimuth: ' + result.azimuth + " ~= " + expected.azimuth);
                    assert.ok(nearlyEquals(result.zenith, expected.zenith, 0.02), 'zenith: ' + result.zenith + " ~= " + expected.zenith);
                    assert.ok(nearlyEquals(result.hourAngle, expected.hourAngle, 0.01), 'hourAngle: ' + result.hourAngle + " ~= " + expected.hourAngle);
                    assert.ok(nearlyEquals(result.subsolarLatitude, expected.subsolarLatitude, 0.01), 'subsolarLatitude: ' + result.subsolarLatitude + " ~= " + expected.subsolarLatitude);
                    assert.ok(nearlyEquals(result.subsolarLongitude, expected.subsolarLongitude, 0.01), 'subsolarLongitude: ' + result.subsolarLongitude + " ~= " + expected.subsolarLongitude);
                    assert.ok(nearlyEquals(result.rightAscension, expected.rightAscension, 0.01), 'rightAscension: ' + result.rightAscension + " ~= " + expected.rightAscension);
                });
            };
            return {run: run};
        });

