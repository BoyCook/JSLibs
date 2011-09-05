<?xml version="1.0" encoding="ISO-8859-1"?>
<!-- Edited by XMLSpy® -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:param name="filter" select="''" />
    <xsl:param name="lc" select="'abcdefghijklmnopqrstuvwxyz'" />
    <xsl:param name="uc" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZ'" />
    <xsl:template match="/cars">
        <div>
            <table width="98%">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Manufacturer</th>
                    </tr>
                </thead>
                <tbody id="transformed">
                    <!--<xsl:for-each select="car">-->
                    <xsl:for-each select="car[
                        (contains(translate(name, $lc, $uc), translate($filter, $lc, $uc)) or
                        contains(translate(manufacturer, $lc, $uc), translate($filter, $lc, $uc)))
                    ]">
                        <xsl:apply-templates select="current()"/>
                    </xsl:for-each>
                </tbody>
            </table>
        </div>
    </xsl:template>
    <xsl:template match="car">
	    <tr>
	        <td>
	            <xsl:value-of select="name"/>
	        </td>
	        <td>
	            <xsl:value-of select="manufacturer"/>
	        </td>
	    </tr>
    </xsl:template>
</xsl:stylesheet>
