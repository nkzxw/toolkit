***main template***
{#template MAIN}
<div>
	<div>{$T.name.bold()}</div>
	{#include table root=$T.table}
</div>
{#/template MAIN}

***main table***
{#template table}
<table>
	{#foreach $T as r}
		{#include row root=$T.r}
	{#/for}
</table>
{#/template table}

***for each row***
{#template row}
<tr class='{#cycle values=["bcEEC","bcCEE"]}'>
	<td>{$T.id}</td>
	<td>{$T.name}</td>
	<td>{$T.age}</td>
	<td>{$T.mail.link('mailto:' + $T.mail)}</td>
</tr>
{#/template row}