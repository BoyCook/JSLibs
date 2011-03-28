<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- Edited by XMLSpy® -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="filter1" select="''" />
    <xsl:param name="filter2" select="''" />
    <xsl:param name="filter3" select="''" />
    <xsl:param name="highlight" select="true()" />
    <xsl:param name="select" select="'link'" />
    <xsl:param name="lc" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:param name="uc" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:template match="/people">
        <div>
            <table width="98%">
                <thead>
                    <tr>
                        <th>Forename</th>
                        <th>Surname</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody id="transformed">
                    <xsl:for-each select="person[
                        (contains(translate(foreName, $lc, $uc), translate($filter1, $lc, $uc)) or
                        contains(translate(surName, $lc, $uc), translate($filter1, $lc, $uc)) or
                        contains(translate(email, $lc, $uc), translate($filter1, $lc, $uc)) or
                        contains(translate(phone, $lc, $uc), translate($filter1, $lc, $uc)))
                        and
                        (contains(translate(forName, $lc, $uc), translate($filter2, $lc, $uc)) or
                        contains(translate(surName, $lc, $uc), translate($filter2, $lc, $uc)) or
                        contains(translate(email, $lc, $uc), translate($filter2, $lc, $uc)) or
                        contains(translate(phone, $lc, $uc), translate($filter2, $lc, $uc)))
                        and
                        (contains(translate(foreName, $lc, $uc), translate($filter3, $lc, $uc)) or
                        contains(translate(surName, $lc, $uc), translate($filter3, $lc, $uc)) or
                        contains(translate(email, $lc, $uc), translate($filter3, $lc, $uc)) or
                        contains(translate(phone, $lc, $uc), translate($filter3, $lc, $uc)))
                    ]">
                        <xsl:sort select="surName" order="ascending" />
                        <tr>
                            <td>
                                <xsl:value-of select="foreName"/>
                            </td>
                            <td>
                                <xsl:value-of select="surName"/>
                            </td>
                            <td>
                                <xsl:value-of select="email"/>
                            </td>
                            <td>
                                <xsl:value-of select="phone"/>
                            </td>
                        </tr>
                    </xsl:for-each>
                </tbody>
            </table>
        </div>
    </xsl:template>
</xsl:stylesheet>
